import React, { Component, PropTypes } from 'react'
import './file-uploader.css'

class FileUploader extends Component {
  
  handleUserInput(event) {
    this.props.onFileSelect(event);
  }
  
  handleFileUpload() {
    this.fileInput.click();
  }
  
  render() {
    const { name, value, placeholder } = this.props;
    
    return (
      <div className="file-uploader">
        <input ref={(element) => this.fileInput = element}
          type="file"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => this.handleUserInput(e)}
          />
        <div className="file-value">
          { value || 'Nothing selected' }
        </div>
        <button 
          className="button ripple primary"
          type="button"
          onClick={() => this.handleFileUpload()}
          >
          { placeholder }
        </button>
      </div>
    );
  }
}

FileUploader.defaultProps = {
  placeholder: 'upload'
}

FileUploader.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onFileSelect: PropTypes.func.isRequired
}

export default FileUploader
