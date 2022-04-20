import * as React from 'react'
import { Form, Button, Grid } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, patchFinish, uploadFile } from '../api/finishs-api'
import { History } from 'history'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}
interface EditFinishProps {
  match: {
    params: {
      finishId: string,
      name: string,
      dueDate: string
    }
  }
  auth: Auth
  history: History
}

interface EditFinishState {
  file: any
  uploadState: UploadState,
  finishName: string
}

export class EditFinish extends React.PureComponent<EditFinishProps,EditFinishState> {
  state: EditFinishState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    finishName: '',
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmitCreateImage = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const finishId = this.props.match.params.finishId;
    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), finishId)

      this.setUploadState(this.state.file)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert('Could not upload a file: '+ errorMessage)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  handleSubmitUpdate = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const finishId = this.props.match.params.finishId;
    try {
      if(!this.state.finishName){
        alert('Finish name not found')
        return
      }
      await patchFinish(this.props.auth.getIdToken(), finishId, {
        name: this.state.finishName,
        dueDate: this.props.match.params.dueDate,
        done: false
      })
      this.props.history.push('/');
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert('error update: '+ errorMessage)
    }
  }

  handleTaskName = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    this.setState({
      finishName: event.target.value
    })
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <div>
          <h1>Update task name</h1>
            <Form onSubmit={this.handleSubmitUpdate}>
              <Form.Field>
                <label>Task Name</label>
                <input
                  placeholder="Enter task name"
                  defaultValue={this.props.match.params.name}
                  onChange={this.handleTaskName}
                />
              </Form.Field>
              <Form.Field>
                <label>Due date</label>
                <input
                  value={this.props.match.params.dueDate}
                  disabled
                  style={{fontWeight: 'bold'}}
                />
              </Form.Field>
              {this.renderButtonUpdate()}
            </Form>
        </div>
        <div>
          <h1>Upload new image</h1>
            <Form onSubmit={this.handleSubmitCreateImage}>
              <Form.Field>
                <label>File</label>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Image to upload"
                  onChange={this.handleFileChange}
                />
              </Form.Field>
              {this.renderButtonCreateImg()}
            </Form>
        </div>
      </div>
    )
  }

  renderButtonCreateImg() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }

  renderButtonUpdate() {
    return (
      <div>
        <Button type="submit" >
          Update
        </Button>
      </div>
    )
  }
}
