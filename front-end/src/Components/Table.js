import React from 'react';
import ReactTable from "react-table";
// import Paper from 'material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import matchSorter from 'match-sorter'
import './Table.css';


class InventoryTable extends React.Component {
  constructor(props) {
      super(props);
      this.state = props.data;
  }
  render() {

    console.log(this.state);

    return (
      <div className='Table'>
        <Typography variant="body2" color="inherit" align="center"> Scroll, sort, and search through the table below to view Outdoors at UVA's Gear Inventory!</Typography>
        <ReactTable
          style={{height:'100%', fontSize:'11px'}}
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

      </div>
    );
  }
}

export default InventoryTable;