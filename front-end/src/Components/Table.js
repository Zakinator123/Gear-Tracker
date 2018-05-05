import React from 'react';
import ReactTable from "react-table";
import { Tip } from './Tip';
import { Paper, Typography } from 'material-ui';
import matchSorter from 'match-sorter'


class InventoryTable extends React.Component {

  constructor(props) {
      super(props);
      this.state = props.data;
  }
  render() {

    console.log(this.state);

    return (
      <Paper style={{height: "65vh", }}>
        {/*<div style={{height:'5.0vh', paddingTop:'1.5vh', fontSize: 12}}>To sort, click the columns headers. Hold shift when sorting to multi-sort! To search on a specific column, type into the textbox below the column headers.</div>*/}
        {/*Need to put a modal containing the above directions in here.*/}
        <ReactTable
          style={{height:'95%', fontSize:'12px'}}
          data={this.state}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          showPaginationBottom={false}
          defaultPageSize={this.state.length}
          minRows={this.state.length}

          columns={[
            {
              /*Need to figure out how to modify header styling*/
              style: {fontColor:'green'},
              columns: [
                {
                  Header: "Number",
                  /*Need to find out what 'id' does - look in react-table documentatinon*/
                  id: "number",
                  accessor: d => d.number,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["number"] }),
                  filterAll: true
                },
                {
                  Header: "Item Type",
                  accessor: "item",
                  /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["item"] }),
                  filterAll: true
                },
                {
                  Header: "Description",
                  accessor: "description",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["description"] }),
                  filterAll: true
                },
                {
                  Header: "Condition",
                  accessor: "condition_level",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["condition_level"] }),
                  filterAll: true
                },
                {
                  Header: "Status",
                  accessor: "status_level",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["status_level"] }),
                  filterAll: true
                },
                {
                  Header: "Notes",
                  accessor: "notes",
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["notes"] }),
                  filterAll: true
                },
              ]
            }
          ]}
          className="-striped -highlight"
        />

      </Paper>
    );
  }
}



export default InventoryTable;