import { URL } from '../models/urlSchema.js';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

const handleGenerateShortURL = async (req, res) => {
  try {
    const { redirectURL } = req.body;
    const userId = req.user._id;
    console.log(userId);
    if (!redirectURL) {
      return res.status(400).json({
        error: 'Please provide a valid URL',
      });
    }

    const shortId = nanoid(4);
    const qrCodeOptions = {
      color: {
        dark: '#808080',
        light: '#0000',
      },
    };

    const qrCodeURL = await QRCode.toDataURL(
      `http://localhost:8080/url/${shortId}`,
      qrCodeOptions
    );
    const shortURL = await URL.create({
      shortId: shortId,
      redirectURL,
      visitHistory: [],
      createdBy: userId,
      qrCodeURL,
    });

    return res.status(200).json({
      shortURL,
      qrCodeURL,
      message: 'Short URL and QR code generated successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const handleRedirectToOriginalURL = async (req, res) => {
  try {
    const { shortId } = req.params;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({
        error: 'Short URL not found',
      });
    }
    res.redirect(entry.redirectURL);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const handleGetAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params;
    const entry = await URL.findOne({ shortId });
    if (!entry) {
      return res.status(404).json({
        error: 'Short URL not found',
      });
    }
    const analytics = {
      totalClicks: entry.visitHistory.length,
      lastVisited: entry.visitHistory[entry.visitHistory.length - 1].timestamp,
    };
    return res.status(200).json({
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const handleGetUrls = async (req, res) => {
  const userId = req.user._id;
  try {
    console.log('Fetching short urls for user', userId);
    const urls = await URL.find({ createdBy: userId });
    return res.status(200).json({
      message: 'Urls fetched successfully',
      url: urls,
    });
  } catch (error) {
    res.status(500).json({
      message: 'url error',
      error: error.message,
    });
  }
};



const handleDeleteUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.user._id;

    const url = await URL.findOne({ shortId });

    if (!url) {
      return res.status(404).json({
        error: 'Short URL not found',
      });
    }

    if (url.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'You are not authorized to delete this URL',
      });
    }
    await URL.deleteOne({ shortId });

    return res.status(200).json({
      message: 'URL deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export { handleDeleteUrl };



export {
  handleGenerateShortURL,
  handleRedirectToOriginalURL,
  handleGetAnalytics,
  handleGetUrls,
};
