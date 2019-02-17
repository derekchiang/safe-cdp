import React, { Component } from "react";
import Rodal from "rodal";
import { Form, Text } from "informed";

// include styles
import "rodal/lib/rodal.css";

export default class SecureModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <div>
        <button onClick={this.show.bind(this)}>SECURE CDP</button>

        <Rodal visible={this.state.visible} onClose={this.hide.bind(this)}>
          <Form>
            <label>
              Target Collateralization:
              <Text field="Target Collateralization" type="number" />
            </label>
            <label>
              Margin Call Threshold:
              <Text field="Margin Call Threshold" type="number" />
            </label>
            <label>
              Margin Call Duration:
              <Text field="Margin Call Duration" type="number" />
            </label>
            <label>
              Reward:
              <Text field="Reward" type="number" />
            </label>
            <label>
              Phone #:
              <Text field="Phone #" type="number" />
            </label>
            <button type="submit">Secure</button>
          </Form>
        </Rodal>
      </div>
    );
  }
}
