import React from 'react';
import pq from 'pqgrid';
import './style.css';

const rGridColData = [
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
  gridRef = React.createRef();
  componentDidCatch(error, errorInfo) {
    console.log(error);
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }
  componentWillUnmount() {
    this.grid.destroy();
    console.log('distroy');
  }
  componentDidMount() {
    this.options = this.props.option;
    this.grid = pq.grid(this.gridRef.current, this.options);
    console.log('mount');
  }
  componentDidUpdate(prevProps) {
    Object.assign(this.options, this.props.option);
    console.log('update');
  }
  render() {
    console.log('render');
    return <div ref={this.gridRef}></div>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

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
      collapsible: { toggled: true },
      scrollModel: { autoFit: true },

      rowHt: 24,
      height: '400',
      columnTemplate: { width: 100 },

      treeModel: { dataIndx: 'name', cascade: true },
      colModel: this.rGridCol,
      dataModel: { data: rGridColData },
    };

    this.state = {
      gridRight: this.rGridOption,
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="grid-right">
          <PqGrid option={this.state.gridRight} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
