import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const title = req.body.title?.toLowerCase().replace(/\s+/g, "-") || "bid";

    if (file.fieldname === "document_type") {
      return {
        folder: "eauction/bid-documents",
        public_id: `${title}-doc`,
        allowed_formats: ["jpg", "jpeg", "png", "pdf"],
        resource_type: "auto",
      };
    }

    return {
      folder: "eauction/bids",
      public_id: `${title}-${file.fieldname}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "document_type") {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only image or PDF files are allowed for documents!"), false);
    }
  } else {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed for bid photos!"), false);
    } else {
      cb(null, true);
    }
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
