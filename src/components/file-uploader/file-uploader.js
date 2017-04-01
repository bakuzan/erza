import React, { Component, PropTypes } from 'react'
import './file-uploader.css'

class FileUploader extends Component {

  uploadFile(file) {
    const data = new FormData();
    data.append('file', file);
    fetch('ENTER_API_ENDPOINT_HERE', { method: "POST", body: data }).then(response => console.log('img upload => ', response));
  }

  handleUserInput(event) {
    console.log(this.fileInput.files);
    const file = this.fileInput.files[0];
    const previewUrl = window.URL.createObjectURL(file);
    // this.uploadFile(file);
    this.props.onFileSelect({
      target: {
        name: this.props.name,
        value: previewUrl
      }
    });
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
          placeholder={placeholder}
          onChange={(e) => this.handleUserInput(e)}
          />
        <div className="file-value flex-all">
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
