import React from 'react';
import pq from 'pqgrid';
import './style.css';
import $ from 'jquery';

const lDataList = {
  rows: [
    { name: 'apple', id: 'f_apple', parentId: '', level: 1 },
    { name: 'orange', id: 'f_orange', parentId: '', level: 1 },
    { name: 'coke', id: 'd_coke', parentId: '', level: 1 },
    { name: 'milk', id: 'd_milk', parentId: '', level: 1 },
  ],
};

const rDataList = {
  rows: [
    { name: 'fruit', id: 'fruit', parentId: '', level: 1 },
    { name: 'banana', id: 'f_banana', parentId: 'fruit', level: 2 },
    { name: 'berry', id: 'f_berry', parentId: 'fruit', level: 2 },
    { name: 'drink', id: 'drink', parentId: '', level: 1 },
    { name: 'sidar', id: 'd_sidar', parentId: 'drink', level: 2 },
    { name: 'coffe', id: 'd_coffe', parentId: 'drink', level: 2 },
  ],
};

class PqGridTree extends React.Component {
  gridRefTree = React.createRef();

  componentDidCatch(error, errorInfo) {
    console.log(error);
  }

  componentWillUnmount() {
    this.grid.destroy();
  }

  componentDidMount() {
    this.options = this.props.option;
    this.grid = pq.grid(this.gridRefTree.current, this.options);
  }

  componentDidUpdate(prevProps) {
    Object.assign(this.options, this.props.option);
  }

  render() {
    return <div ref={this.gridRefTree}></div>;
  }

  setData(dataModelOpt) {
    var new_data = $.extend(true, [], dataModelOpt.data);
    dataModelOpt.data = new_data;
    this.grid.option('dataModel', dataModelOpt);
    this.grid.refreshDataAndView();
  }

  getChanges() {
    return this.grid.getChanges();
  }

  getDatas() {
    return this.grid.option('dataModel.data');
  }
}

class PqGrid extends React.Component {
  gridRef = React.createRef();

  componentDidMount() {
    this.options = this.props.option;
    this.grid = pq.grid(this.gridRef.current, this.options);
  }
  componentDidUpdate(prevPros) {
    Object.assign(this.options, this.props.option);
  }
  componentDidCatch(error, errorInfo) {
    console.log(error);
  }

  render() {
    return <div ref={this.gridRef}></div>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.gridLeftHeight = { width: '43%' };
    this.gridMidHeight = { width: '5%' };
    this.gridRightHeight = { width: '43%' };

    this.callReftRight = React.createRef();

    this.lGridCol = [
      {
        dataIndx: 'name',
        width: 200,
        title: 'Name',
        type: 'checkbox',
        cbId: 'chk',
      },
      {
        dataIndx: 'chk',
        dataType: 'bool',
        cb: { header: true },
        hidden: true,
        editable: true,
      },
      { dataIndx: 'id', width: 50, title: 'id', hidden: true },
      { dataIndx: 'parentId', width: 50, title: 'parent', hidden: true },
      { dataIndx: 'level', width: 50, title: 'level', hidden: true },
    ];

    this.rGridCol = [
      { dataIndx: 'name', width: 200, title: 'Name' },
      { dataIndx: 'id', width: 50, title: 'id', hidden: true },
      { dataIndx: 'parentId', width: 50, title: 'parent', hidden: true },
      { dataIndx: 'level', width: 50, title: 'level', hidden: true },
    ];

    this.lGridOption = {
      showTitle: false,
      reactive: true,
      locale: 'en',
      animModel: { on: true },
      collapsible: { on: false, toggled: false },
      scrollModel: { autoFit: true },
      hoverMode: 'row',
      numberCell: { show: true, width: 45 },
      editable: false,

      rowHt: 24,
      height: '400',
      columnTemplate: { width: 100 },

      colModel: this.lGridCol,
      dataModel: { data: [] },

      dragModel: { on: true, diHelper: 'name' },
      dropModel: {
        on: true,
        drop: function (evt, uiDrop) {
          var rowIndx = uiDrop.rowIndx + (uiDrop.ratioY() > 0.5 ? 1 : 0);
          var nodes = uiDrop.helper.data('Drag').cellObj.nodes;

          nodes.foreach((row) => {});
          this.addNodes(nodes, isNaN(rowIndx) ? null : rowIndx);
        },
      },
    };

    this.rGridOption = {
      showTitle: false,
      locale: 'en',
      animModel: { on: true },
      collapsible: { on: false, toggled: false },
      scrollModel: { autoFit: true },
      hoverMode: 'row',

      numberCell: { show: true, width: 45 },
      editable: false,
      trackModel: { on: true },

      rowHt: 24,
      height: '400',
      columnTemplate: { width: 100 },

      colModel: this.rGridCol,
      dataModel: { data: [] },

      treeModel: {
        checkbox: true,
        select: true,
        dataIndx: 'name',
        cascade: true,
        format: 'nested',

        id: 'id',
        parentId: 'parentId',
      },

      dragModel: {
        on: true,
        diHelper: 'name',
        dragNodes: function (rd, evt) {
          var checkNodes = this.Tree().getCheckedNodes();
          return checkNodes.length && checkNodes.indexOf(rd) > -1
            ? checkNodes
            : [rd];
        },
      },
      dropModel: { on: true },
      moveNode: function (evt, ui) {
        let grid = this,
          Tree = grid.Tree();
        ui.args[0].forEach(function (rd) {
          Tree.eachChild(rd, function (node) {
            let pnode = Tree.getParent(node);
            node.unitLevel = node.pq_level + 1;
            node.level = node.unitLevel;
            node.parentId = pnode.id;
            grid.refreshCell({
              rowIndx: node.pq_ri,
              dataIndex: 'level',
            });
          });
        });
      },
    };

    this.state = {
      gridLeft: this.lGridOption,
      gridRight: this.rGridOption,
    };

    this.btnSearch_Click = this.btnSearch_Click.bind(this);
    this.btnSave_Click = this.btnSave_Click.bind(this);
  }

  btnSearch_Click(event) {
    let lData = [...lDataList.rows];
    this.setState(function (state) {
      let dm = Object.assign({}, this.lGridOption.dataModel);
      dm.data = lData;
      return { gridLeft: { dataModel: dm } };
    });

    let rData = rDataList.rows;
    let dataModelRightOpt = {
      dataType: 'JSON',
      location: 'local',
      recIndx: 'id',
      data: rData,
    };
    this.callReftRight.current.setData(dataModelRightOpt);
  }

  btnSave_Click(event) {
    let chgDataRight = this.callReftRight.current.getChanges();
    console.log(chgDataRight);

    let dataRigth = this.callReftRight.current.getDatas();
    console.log(dataRigth);
  }

  render() {
    return (
      <React.Fragment>
        <div className="header">
          <div className="btn-grp">
            <button onClick={this.btnSearch_Click}>Search</button>
            <button onClick={this.btnSave_Click}>Save</button>
          </div>
        </div>
        <div className="content">
          <div className="grid-left" style={this.gridLeftHeight}>
            <PqGrid option={this.state.gridLeft} />
          </div>
          <div className="grid-middle" style={this.gridMidHeight}></div>
          <div className="grid-right" style={this.gridRightHeight}>
            <PqGridTree
              option={this.state.gridRight}
              ref={this.callReftRight}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
