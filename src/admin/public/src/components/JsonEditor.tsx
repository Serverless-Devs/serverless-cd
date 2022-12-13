import React, { PureComponent } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
// import jsonlint from 'jsonlint-mod';
import { isJson } from '../utils';

// window.jsonlint = jsonlint;

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
  showFormatBtn?: boolean;
};

class JsonEditor extends PureComponent<Props> {
  options: any;
  constructor(props) {
    super(props);
    const { mode = 'json', lint = true, height, width } = this.props;
    const options = { ...DEFAULT_OPTIONS, mode, lint, height, width };
    this.options = options;
  }

  render() {
    const { value, onChange, showFormatBtn = true } = this.props;
    return (
      <div className='json-editor' style={{ position: 'relative' }}>
        <CodeMirror
          onBeforeChange={(editor, data, value) => {
            onChange(value);
          }}
          value={value || ''}
          options={this.options}
        />
        {value && showFormatBtn && isJson(value) && (
          <span
            className="text-description color-primary"
            style={{
              position: 'absolute',
              right: 20,
              top: 5,
              zIndex: 25,
              cursor: 'pointer',
            }}
            onClick={() => {
              if (isJson(value)) {
                onChange(JSON.stringify(JSON.parse(value), null, 4));
              }
            }}
          >
            格式化
          </span>
        )}
      </div>
    );
  }
}

export default JsonEditor;
