import React, { PureComponent } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';

const DEFAULT_OPTIONS = {
  mode: 'json',
  gutters: ['CodeMirror-lint-markers'],
  styleActiveLine: true,
  lineNumbers: true,
  line: true,
  lint: true,
};

type Props = {
  value: string;
  onChange: Function;
  height: any;
  width: any;
  mode?: string;
  lint?: boolean;
  name?: string;
};

class MyCodeMirror extends PureComponent<Props> {
  options: any;
  constructor(props) {
    super(props);
    const { mode = 'json', lint = true, height, width } = this.props;
    const options = { ...DEFAULT_OPTIONS, mode, lint, height, width };
    this.options = options;
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <div style={{ position: 'relative', border: '1px solid rgb(238, 238, 238)' }}>
        <CodeMirror
          onBeforeChange={(editor, data, value) => {
            onChange(value);
          }}
          value={value}
          options={this.options}
        />
      </div>
    );
  }
}

export default MyCodeMirror;
