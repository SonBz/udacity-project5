import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createFinish, deleteFinish, getFinishs, patchFinish } from '../api/finishs-api'
import Auth from '../auth/Auth'
import { Finish } from '../types/Finish'

interface FinishsProps {
  auth: Auth
  history: History
}

interface FinishsState {
  finishs: Finish[]
  newFinishName: string
  loadingFinishs: boolean
}

export class Finishs extends React.PureComponent<FinishsProps, FinishsState> {
  state: FinishsState = {
    finishs: [],
    newFinishName: '',
    loadingFinishs: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFinishName: event.target.value })
  }

  onEditButtonClick = (finishId: string) => {
    this.props.history.push(`/finishs/${finishId}/edit`)
  }

  onFinishCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newFinish = await createFinish(this.props.auth.getIdToken(), {
        name: this.state.newFinishName,
        dueDate
      })
      this.setState({
        finishs: [...this.state.finishs, newFinish],
        newFinishName: ''
      })
    } catch {
      alert('Finish creation failed')
    }
  }

  onFinishDelete = async (finishId: string) => {
    try {
      await deleteFinish(this.props.auth.getIdToken(), finishId)
      this.setState({
        finishs: this.state.finishs.filter(finish => finish.finishId !== finishId)
      })
    } catch {
      alert('Finish deletion failed')
    }
  }

  onFinishCheck = async (pos: number) => {
    try {
      const finish = this.state.finishs[pos]
      await patchFinish(this.props.auth.getIdToken(), finish.finishId, {
        name: finish.name,
        dueDate: finish.dueDate,
        done: !finish.done
      })
      this.setState({
        finishs: update(this.state.finishs, {
          [pos]: { done: { $set: !finish.done } }
        })
      })
    } catch {
      alert('Finish deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const finishs = await getFinishs(this.props.auth.getIdToken())
      this.setState({
        finishs,
        loadingFinishs: false
      })
    } catch (e) {
      alert(`Failed to fetch finishs: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">FINISHS</Header>

        {this.renderCreateFinishInput()}

        {this.renderFinishs()}
      </div>
    )
  }

  renderCreateFinishInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onFinishCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFinishs() {
    if (this.state.loadingFinishs) {
      return this.renderLoading()
    }

    return this.renderFinishsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Finishs
        </Loader>
      </Grid.Row>
    )
  }

  renderFinishsList() {
    return (
      <Grid padded>
        {this.state.finishs.map((finish, pos) => {
          return (
            <Grid.Row key={finish.finishId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onFinishCheck(pos)}
                  checked={finish.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {finish.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {finish.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(finish.finishId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFinishDelete(finish.finishId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {finish.attachmentUrl && (
                <Image src={finish.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
