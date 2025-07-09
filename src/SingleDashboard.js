import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const DrivingLicenseUpload = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [currentLicense, setCurrentLicense] = useState(null);

  // Mock function to extract license details from uploaded image
  const extractLicenseDetails = (file) => {
    // In a real app, this would use OCR or image processing
    const mockDetails = {
      licenseNumber: `D${Math.floor(Math.random() * 90000000) + 10000000}`,
      name: 'Bonnie B.',
      dateOfBirth: '01/15/1985',
      address: 'Iscon Platinum, Bopal',
      issueDate: '08/01/2020',
      expirationDate: '08/01/2024'
    };
    return mockDetails;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        
        setCurrentLicense({
          imageUrl,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (currentLicense) {
      // Extract details only when submitting
      const licenseDetails = extractLicenseDetails(currentLicense);
      const completeDocument = {
        ...licenseDetails,
        imageUrl: currentLicense.imageUrl,
        fileName: currentLicense.fileName
      };
      
      setUploadedDocuments(prev => [...prev, completeDocument]);
      setCurrentLicense(null);
    }
  };

  const handleBrowseClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className="license-upload-container">
      <div className="upload-section">
        <div className="upload-area">
          <div className="upload-icon">
            <Upload size={32} />
          </div>
          <h2>Upload image of driving license</h2>
          <p>or <span className="browse-link" onClick={handleBrowseClick}>browse</span></p>
          
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          {currentLicense && (
            <div className="license-preview">
              <div className="license-card">
                <div className="license-header">DRIVING LICENSE</div>
                <div className="license-content">
                  <div className="license-photo">
                    <img src={currentLicense.imageUrl} alt="License" />
                  </div>
                  <div className="license-info">
                    <div className="license-placeholder">Image uploaded successfully</div>
                    <div className="license-placeholder-small">Ready to submit</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button 
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!currentLicense}
          >
            Submit
          </button>
        </div>
      </div>

      {currentLicense && (
        <div className="license-details-section">
          <h3>Driving License Details</h3>
          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">Image uploaded - click Submit to process</span>
            </div>
          </div>
        </div>
      )}

      {uploadedDocuments.length > 0 && (
        <div className="uploaded-documents-section">
          <h3>Uploaded Documents</h3>
          <div className="documents-grid">
            {uploadedDocuments.map((doc, index) => (
              <div key={index} className="document-card">
                <div className="document-preview">
                  <div className="license-card-small">
                    <div className="license-header-small">DRIVING LICENSE</div>
                    <div className="license-content-small">
                      <div className="license-photo-small">
                        <img src={doc.imageUrl} alt="License" />
                      </div>
                      <div className="license-info-small">
                        <div className="license-name-small">{doc.name}</div>
                        <div className="license-number-small">{doc.licenseNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="document-id">{doc.licenseNumber}</div>
              </div>
            ))}
          </div>
          
          {/* Show details of the last uploaded document */}
          {uploadedDocuments.length > 0 && (
            <div className="license-details-section" style={{ marginTop: '30px' }}>
              <h3>Latest Document Details</h3>
              <div className="details-grid">
                <div className="detail-row">
                  <span className="detail-label">License Number</span>
                  <span className="detail-value">{uploadedDocuments[uploadedDocuments.length - 1].licenseNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{uploadedDocuments[uploadedDocuments.length - 1].name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-value">{uploadedDocuments[uploadedDocuments.length - 1].dateOfBirth}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{uploadedDocuments[uploadedDocuments.length - 1].address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Issue Date</span>
                  <span className="detail-value">{uploadedDocuments[uploadedDocuments.length - 1].issueDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Expiration Date</span>
                  <span className="detail-value">{uploadedDocuments[uploadedDocuments.length - 1].expirationDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .license-upload-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f5f5;
        }

        .upload-section {
          background: white;
          border-radius: 12px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .upload-area {
          text-align: center;
        }

        .upload-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #e3f2fd;
          border-radius: 50%;
          margin-bottom: 20px;
          color: #1976d2;
        }

        .upload-area h2 {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #333;
        }

        .upload-area p {
          color: #666;
          margin: 0 0 30px 0;
        }

        .browse-link {
          color: #1976d2;
          cursor: pointer;
          text-decoration: underline;
        }

        .license-preview {
          margin: 30px 0;
          display: flex;
          justify-content: center;
        }

        .license-card {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          border-radius: 12px;
          padding: 16px;
          color: white;
          width: 350px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .license-header {
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .license-content {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .license-photo {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f0f0f0;
        }

        .license-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .license-info {
          flex: 1;
        }

        .license-placeholder {
          font-size: 14px;
          margin-bottom: 4px;
          text-align: center;
        }

        .license-placeholder-small {
          font-size: 12px;
          opacity: 0.8;
          text-align: center;
        }

        .submit-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 12px 48px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1565c0;
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .license-details-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .license-details-section h3 {
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #333;
        }

        .details-grid {
          display: grid;
          gap: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .detail-label {
          font-weight: 500;
          color: #666;
        }

        .detail-value {
          font-weight: 600;
          color: #333;
        }

        .uploaded-documents-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .uploaded-documents-section h3 {
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #333;
        }

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .document-card {
          text-align: center;
        }

        .document-preview {
          margin-bottom: 12px;
        }

        .license-card-small {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          border-radius: 8px;
          padding: 12px;
          color: white;
          width: 180px;
          margin: 0 auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .license-header-small {
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .license-content-small {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .license-photo-small {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f0f0f0;
        }

        .license-photo-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .license-info-small {
          flex: 1;
          text-align: left;
        }

        .license-name-small {
          font-size: 10px;
          margin-bottom: 2px;
        }

        .license-number-small {
          font-size: 9px;
          opacity: 0.8;
        }

        .document-id {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        @media (max-width: 768px) {
          .license-upload-container {
            padding: 10px;
          }

          .upload-section {
            padding: 20px;
          }

          .license-card {
            width: 100%;
            max-width: 320px;
          }

          .documents-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default DrivingLicenseUpload;