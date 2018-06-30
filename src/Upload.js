import React, { Component } from "react";
import "./App.css";
import { withCookies } from "react-cookie";
import { Redirect } from "react-router";
import { Checkbox, Dropdown } from "semantic-ui-react";
import Moment from "moment";
import DropZone from 'react-dropzone';
import "./Upload.css";

var expiry_options = [
  {
    key: "never",
    text: "Never",
    value: false
  },
  {
    key: "12h",
    text: "12 Hours",
    value: [12, "hours"]
  },
  {
    key: "1d",
    text: "1 Day",
    value: [1, "days"]
  },
  {
    key: "3d",
    text: "3 Days",
    value: [3, "days"]
  },
  {
    key: "7d",
    text: "7 Days",
    value: [7, "days"]
  },
  {
    key: "14d",
    text: "14 Days",
    value: [14, "days"]
  }
];

class Upload extends Component {
  constructor(props) {
    super();
    this.state = {
      uploading: false,
      uploaded: false,
      error: false,
      error_msg: "",
      uploadPrivacy: false,
      expires_at: null
    };
  }

  showError = msg => {
    console.log(msg)
    this.setState({
      error: true,
      error_msg: msg
    });
  };

  uploadImageData = (img_data) => {
    if (!this.state.user) {
      this.showError("You are not logged in.");
      return null;
    }
    this.setState({ uploading: true });
    fetch("http://localhost:8000/api/uploadImage", {
      method: "POST",
      body: JSON.stringify({
        img_data: img_data,
        is_private: this.state.uploadPrivacy,
        expires_at: this.state.expires_at
      }),
      headers: {
        "content-type": "application/json",
        api_key: this.state.user.api_key
      }
    })
      .then(res => {
        res.json().then(data => {
          if (!res.ok) {
            this.setState({ uploading: false });
            this.showError(data.message);
          } else {
            this.setState({
              imgID: data.url,
              uploaded: true
            });
          }
        });
      })
      .catch(err => {
        this.setState({ uploading: false });
        this.showError(err);
      });
  };

  uploadImageFile = (img_file) => {
    if (!this.state.user) {
      this.showError("You are not logged in.");
      return null;
    }
    this.setState({ uploading: true });
    const reader = new FileReader()
    reader.onload = (event) => {
      const file = event.target.result
      let data = new FormData()
      data.append("img_file", file)
      data.append("is_private", this.state.uploadPrivacy)
      data.append("expires_at", this.state.expires_at)
      fetch("http://localhost:8000/api/uploadImage", {
        method: "POST",
        body: data,
        headers: {
          "content-type": "application/json",
          api_key: this.state.user.api_key
        }
      })
        .then(res => {
          res.json().then(data => {
            if (!res.ok) {
              this.setState({ uploading: false });
              this.showError(data.message);
            } else {
              this.setState({
                imgID: data.url,
                uploaded: true
              });
            }
          });
        })
        .catch(err => {
          this.setState({ uploading: false });
          this.showError(err);
        });
    }
    reader.readAsArrayBuffer(img_file)
  };

  filesDropped = (files) => {
    this.uploadImageFile(files[0])
  }

  pasteHandler = () => {
    new CLIPBOARD_CLASS(this.uploadImageData, this.showError);

    /**
     * image pasting into canvas
     *
     * @param string canvas_id canvas id
     * @param boolean autoresize if canvas will be resized
     */
    function CLIPBOARD_CLASS(upload_callback, err_callback) {
      var _self = this;

      document.addEventListener(
        "paste",
        function(e) {
          _self.paste_auto(e);
        },
        false
      ); //official paste handler

      //default paste action
      this.paste_auto = function(e) {
        if (e.clipboardData) {
          var items = e.clipboardData.items;
          if (items) {
            //access data directly
            for (var i = 0; i < items.length; i++) {
              if (items[i].type.indexOf("image") !== -1) {
                var blob = items[i].getAsFile();
                var reader = new FileReader();
                reader.onload = function(event) {
                  var img_data = event.target.result;

                  upload_callback(img_data);
                };
                /* Convert the blob from clipboard to base64 */

                reader.readAsDataURL(blob);
              } else {
                err_callback("Paste was not an image");
              }
            }
            e.preventDefault();
          }
        }
      };
    }
  };

  changePrivacy = (e, el) => {
    this.setState({
      uploadPrivacy: el.checked
    });
  };

  changeExpiration = (e, el) => {
    if (el.value) {
      this.setState({
        expires_at: Moment().add(...el.value)
      });
    } else {
      this.setState({
        expires_at: null
      });
    }
  };

  componentDidMount() {
    this.pasteHandler();
    var { cookies } = this.props;
    if (cookies.get("user")) {
      let userData = cookies.get("user")
      userData = decodeURI(userData)
      userData = JSON.parse(atob(userData))
      console.log(userData.api_key)
      this.setState({
        user: userData
      });
    } else {
      this.showError(
        <a
          href="/login"
          style={{ color: "white", textDecoration: "underline" }}
        >
          {this.state.user} You won't be able to upload without logging in
        </a>
      );
    }
  }
  render() {
    return (
      <div className="UploadPage">
        {this.state.error && (
          <div style={{ backgroundColor: "red" }}>
            <p style={{ color: "white", margin: "0", padding: "15px 0" }}>
              {this.state.error_msg}
            </p>
          </div>
        )}
        {this.state.uploading && (
          <div style={{ backgroundColor: "green" }}>
            <p style={{ color: "white", margin: "0", padding: "15px 0" }}>
              Uploading..
            </p>
          </div>
        )}
        {this.state.uploaded && <Redirect to={"/" + this.state.imgID} />}
        <h1>Upload</h1>
        <p style={{ padding: "0" }}>
          Paste an screenshot onto the page<strike>
            , drag&drop, or select a file
          </strike>
        </p>
        <div className="options">
          <Checkbox label="Private" onChange={this.changePrivacy} />
          <Dropdown
            label="Expiration"
            placeholder="Never"
            options={expiry_options}
            onChange={this.changeExpiration}
          />
        </div>
        {this.state.expires_at && (
          <p>
            This image will expire on {this.state.expires_at.format("ll LT")}
          </p>
        )}
        <div className="dropzone">
          <DropZone
            onDrop={this.filesDropped.bind(this)}
            accept="image/jpeg, image/png"
            multiple={false}
          >
            Drag and drop an image here, or click to select an image
          </DropZone>
        </div>
      </div>
    );
  }
}

export default withCookies(Upload);
