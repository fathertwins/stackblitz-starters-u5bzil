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

  componentDidMount() {
    this.options = this.props.option;
    this.grid = pq.grid(this.gridRefTree.current, this.options);
  }
  componentDidUpdate(prevProps) {
    Object.assign(this.options, this.props.option);
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
  }
  componentWillUnmount() {
    this.grid.destroy();
  }

  render() {
    return (
      <React.StrictMode>
        <div ref={this.gridRefTree}></div>
      </React.StrictMode>
    );
  }

  setData(dataModelOpt) {
    var new_data = $.extend(true, [], dataModelOpt.data);
    //either use this.
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
  componentDidUpdate(prevProps) {
    Object.assign(this.options, this.props.option);
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
  }

  render() {
    return (
      <React.StrictMode>
        <div ref={this.gridRef}></div>
      </React.StrictMode>
    );
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
      collapsible: { on: false, toggle: false },
      scrollModel: { autoFit: true },
      numberCell: { show: true, width: 45 },
      hoverMode: 'row',
      selectionModel: { type: 'row', mode: 'single' },
      editable: false,

      rowHt: 24,
      height: '400',
      columnTemplate: { width: 100 },

      colModel: this.lGridCol,
      dataModel: { data: [] },

      dragModel: {
        on: true,
        diHelper: ['name'],
      },
      dropModel: {
        on: true,
        drop: function (evt, uiDrop) {
          var rowIndx = uiDrop.rowIndx + (uiDrop.ratioY() > 0.5 ? 1 : 0);
          var nodes = uiDrop.helper.data('Drag').cellObj.nodes;
          nodes.forEach((row) => {
            row.parentId = '';
            row.level = 1;
            delete row.pq_cellcls;
            delete row.pq_hidden;
            delete row.pq_hideOld;
            delete row.pq_ht;
            delete row.pq_level;
            delete row.pq_ri;
            delete row.pq_rowcls;
            delete row.pq_rowselect;
            delete row.pq_top;
            delete row.pq_tree_cb;
            delete row.unitLevel;
          });

          this.addNodes(nodes, isNaN(rowIndx) ? null : rowIndx);
        },
      },
    };

    this.rGridOption = {
      showTitle: false,
      locale: 'en',
      animModel: { on: true },
      collapsible: { toggle: false, on: false },
      scrollModel: { autoFit: true },

      numberCell: { show: true, width: 45 },
      hoverMode: 'row',
      editable: false,
      trackModel: { on: true },

      rowHt: 24,
      height: '400',
      columnTemplate: { width: 100 },

      treeModel: {
        checkbox: true,
        select: true,

        dataIndx: 'name',
        cascade: true,
        format: 'nested',

        id: 'id',
        parentId: 'parentId',
        historyMove: true,
        historyAdd: true, //7.4
        historyDelete: true, //7.4
        leafIfEmpty: true, //7.4
      },
      colModel: this.rGridCol,
      dataModel: { data: [] },

      dragModel: {
        on: true,
        diHelper: ['name'],
        dragNodes: function (rd, evt) {
          var checkNodes = this.Tree().getCheckedNodes();
          return checkNodes.length && checkNodes.indexOf(rd) > -1
            ? checkNodes
            : [rd];
        },
      },
      dropModel: {
        on: true,
        divider: 200,
      },
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
              dataIndx: 'level',
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
