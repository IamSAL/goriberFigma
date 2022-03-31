const preview = async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== "swtdev") {
    return res.status(401).json({ message: "Invalid token" });
  }

  res.setPreviewData({});

  res.writeHead(307, { Location: "/" });
  res.end();

  //   res.redirect(req.query.slug)
};
export default preview;
