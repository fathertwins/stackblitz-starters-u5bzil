import React from 'react';
import pq from 'pqgrid';
import './style.css';

const rGridColData1 = [
  {
    id: 0,
    name: 'C',
    date: '02/19/2010',
    children: [
      {
        id: 1,
        name: 'my.ini',
        size: 9,
        date: '05/18/2013',
      },
      {
        id: 2,
        name: 'Program Files',
        date: '03/21/2016',
        children: [
          {
            id: 21,
            name: 'Java',
            date: '01/13/2010',
            pq_close: false,
            children: [
              {
                id: 211,
                name: 'java.exe',
                size: 142,
                date: '01/10/2015',
                pq_tree_cb: true, //to check the checkbox.
              },
              {
                id: 212,
                name: 'license.txt',
                size: 5,
                date: '01/01/2016',
              },
            ],
          },
          {
            id: 23,
            name: 'my.ini',
            size: '9',
            date: '05/18/2013',
          },
        ],
      },
    ],
  },
];

const rGridColData2 = [
  {
    id: 0,
    name: 'C',
    date: '02/19/2010',
    children: [
      {
        id: 1,
        name: 'my.ini',
        size: 9,
        date: '05/18/2013',
      },
      {
        id: 2,
        name: 'Program Files',
        date: '03/21/2016',
        children: [
          {
            id: 21,
            name: 'Java',
            date: '01/13/2010',
            pq_close: false,
            children: [
              {
                id: 211,
                name: 'java.exe',
                size: 142,
                date: '01/10/2015',
                pq_tree_cb: true, //to check the checkbox.
              },
              {
                id: 212,
                name: 'license.txt',
                size: 5,
                date: '01/01/2016',
              },
            ],
          },
          {
            id: 22,
            name: 'Android',
            date: '01/13/2010',
            pq_close: false,
            children: [
              {
                id: 221,
                name: 'license.txt',
                size: 9,
                date: '05/18/2013',
                pq_tree_cb: true, //to check the checkbox.
              },
              {
                id: 222,
                name: 'Android SDK',
                size: '5',
                date: '02/25/2013',
              },
              {
                id: 223,
                name: 'Chrome',
                size: '5',
                date: '03/25/2013',
              },
              {
                id: 224,
                name: 'firefox',
                size: '3',
                date: '03/26/2013',
              },
            ],
          },
          {
            id: 23,
            name: 'my.ini',
            size: '9',
            date: '05/18/2013',
          },
        ],
      },
      {
        id: 4,
        name: 'my.ini',
        size: 9,
        date: '05/18/2013',
      },
    ],
  },
];

class PqGrid extends React.Component {
  //constructor(props)
  //super(props)
  gridRef = React.createRef();
  componentDidMount() {
    this.options = this.props.option;
    this.grid = pq.grid(this.gridRef.current, this.options);
    console.log('mount');
    console.log(this.props.option.treeModel);
    console.log(this.props.option.dataModel.data[0].children);
  }
  componentDidUpdate(prevProps) {
    console.log('update');
    console.log(prevProps.option.dataModel.data[0].children);
    console.log(this.options.dataModel.data[0].children);

    Object.assign(this.options, this.props.option);

    console.log(this.options);
    console.log(this.options.treeModel);
    console.log(this.options.dataModel.data[0].children);
    console.log(this.props.option);
    console.log(this.props.option.dataModel.data[0].children);
  }
  componentWillUnmount() {
    this.grid.destroy();
    console.log('destroy');
  }
  componentDidCatch(error, errorInfo) {
    console.log('-->' + error);
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }
  render() {
    console.log('render');
    return <div ref={this.gridRef}></div>;
  }
  //expose Customize method
  // onTree(opt) {
  //   this.grid.Tree().option(opt);
  // }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.callRef = React.createRef();
    this.bthSearch_Click = this.bthSearch_Click.bind(this);

    this.rGridCol = [
      { dataIndx: 'pq_tree_cb', width: 100, hidden: true },
      { dataIndx: 'name', width: 200, title: 'Name' },
      { dataIndx: 'size', title: 'Size', width: 100, dataType: 'float' },
      {
        dataIndx: 'date',
        title: 'Modified Date',
        width: 100,
        dataType: 'date',
      },
    ];

    this.rGridOption = {
      showTitle: false,
      //reactive: true,
      locale: 'en',
      animModel: { on: true },
      collapsible: { on: false, toogle: false },
      scrollModel: { autoFit: true },

      rowHt: 24,
      height: '400',
      columnTemplate: { width: 100 },

      //this is error => do not use treeModel when initialize
      treeModel: { dataIndx: 'name', cascade: true },
      colModel: this.rGridCol,
      dataModel: { data: rGridColData1 },
    };

    this.state = {
      gridRight: this.rGridOption,
    };
  }

  // componentDidMount() {
  //   this.timer = setTimeout(() => {
  //     this.callRef.current.onTree({ dataIndx: 'name', cascade: true });
  //   }, 1000);
  // }
  // componentDidUpdate() {
  //   clearTimeout(this.timer);
  // }

  bthSearch_Click(event) {
    this.setState(function (state) {
      let datamodel = Object.assign({}, state.gridRight.dataModel);
      datamodel.data = rGridColData2;
      return { gridRight: { dataModel: datamodel } };
    });

    // this.timer = setTimeout(() => {

    // }, 1000);
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.bthSearch_Click}>Search</button>
        <div className="grid-right">
          <PqGrid option={this.state.gridRight} ref={this.callRef} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
