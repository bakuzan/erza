import React, {Component} from 'react'

import fetchFromServer from '../../graphql/fetch'
import Dialog from '../dialog/dialog'
import ClearableInput from '../clearable-input/clearable-input'
import FileUploader from '../file-uploader/file-uploader'
import {isString} from '../../utils/common'
import {Paths} from '../../constants/paths'


const defaults = {
  imageFile: "",
  imageUrl: "",
  imageMessage: ""
}

const postToImgur = data => {
  const isStringData = isString(data)
  const imgurUrl = isStringData
    ? Paths.imgur.postUrl
    : Paths.imgur.postFile

  return fetchFromServer(imgurUrl, "POST", { image: data })
}

class ImageSelector extends Component {

  constructor(props) {
    super(props)
    this.state = defaults

    this.assignDialogRef = this.assignDialogRef.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleUserSelection = this.handleUserSelection.bind(this)
  }

  assignDialogRef(element) {
    this.dialog = element;
  }

  handleSubmit(event) {
    console.log("UPLOAD >> ", this.state.imageFile || this.state.imageUrl);
    postToImgur(this.state.imageFile || this.state.imageUrl).then(result => {
      if (result && result.success) {
        console.log("imgur upload result", result)
        this.props.onChange({
          target: { name: this.props.name, type: "text", value: result.url }
        })
      }
    })
    this.dialog.close();
  }

  handleOpenDialog() {
    this.dialog.showModal();
  }

  handleUserSelection(event) {
    const { name, value, files } = event.target;
    const hasFiles = !!files && files.length;
    this.setState({
      ...defaults,
      [name]: hasFiles ? files[0] : value,
      imageMessage: hasFiles ? value : ""
    });
  }

  render() {
    console.log(this.state);
    return (
      <div className="file-uploader">
        <div className="file-value">
          { this.props.url || 'Nothing selected' }
        </div>
        <button
          className="button ripple primary"
          type="button"
          onClick={this.handleOpenDialog}
          >
          Select image
        </button>
        <Dialog
          name="image-selection"
          title="Select an image"
          getDialogRef={this.assignDialogRef}
          actionText="Save"
          action={this.handleSubmit}
          >
          <ClearableInput
            name="imageUrl"
            label="Image Url"
            value={this.state.imageUrl}
            onChange={this.handleUserSelection}
            />

          <FileUploader
            name="imageFile"
            value={this.state.imageMessage}
            placeholder="upload image"
            onFileSelect={this.handleUserSelection}
          />
        </Dialog>
      </div>
    );
  }
}


export default ImageSelector
