import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getFinishById, getUploadUrl, patchFinish, uploadFile } from '../api/finishs-api'
import { History } from 'history'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

var finishOb: any;
interface EditFinishProps {
  match: {
    params: {
      finishId: string
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
  
  // constructor(props: EditFinishProps | Readonly<EditFinishProps>) {
  //   super(props);
  //   try {
  //     getFinishById(this.props.auth.getIdToken(), this.props.match.params.finishId).then(val =>{
  //         finishOb = val
  //         this.setState({
  //           finishName: finishOb.name
  //         })
  //       }
  //     )
  //   } catch (e) {
  //     alert(`Failed to fetch finishs: ${e}`)
  //   }
  // }
  async componentWillMount() {
    try {
      finishOb = await getFinishById(this.props.auth.getIdToken(), this.props.match.params.finishId)
      this.setState({
        finishName: finishOb.name
      })
    } catch (e) {
      alert(`Failed to fetch finishs: ${e}`)
    }
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const finishId = this.props.match.params.finishId;
    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      if(!this.state.finishName){
        alert('Finish name not found')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      await patchFinish(this.props.auth.getIdToken(), finishId, {
        name: this.state.finishName,
        dueDate: finishOb.dueDate,
        done: finishOb.done
      })
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), finishId)

      this.setUploadState(this.state.file)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
      this.props.history.push('/');
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
        <h1>Update image and task name</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Task Name</label>
            <input
              placeholder="Enter task name"
              value={this.state.finishName}
              onChange={this.handleTaskName}
            />
          </Form.Field>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>
          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
