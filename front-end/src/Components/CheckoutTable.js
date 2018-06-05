import React from 'react';
import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import LinearIndeterminate from './Loading';


class CheckoutTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data : [],
            fetched : false
        };

        fetch(props.apiHost + '/checkout/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                this.setState({data: myJson,
                    fetched: true})
            });
    }


    render() {

        let jsx;
        if (this.state.fetched)
            jsx = (
                <ReactTable
                    style={{height:'100%', fontSize:'11px'}}
                    data={this.state.data}
                    showPaginationBottom={false}
                    defaultPageSize={this.state.data.length}
                    minRows={this.state.data.length}

                    columns={[
                        {
                            /*Need to figure out how to modify header styling*/
                            style: {fontColor:'green'},
                            columns: [
                                {
                                    Header: "Gear #",
                                    /*Need to find out what 'id' does - look in react-table documentatinon*/
                                    id: "number",
                                    minWidth: 70,
                                    accessor: d => d.number,
                                },
                                {
                                    Header: "Item Type",
                                    accessor: "item",
                                    /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                                },
                                {
                                    Header: "Checked Out To",
                                    accessor: "member"
                                },
                                {
                                    Header: "Checkout Date",
                                    minWidth: 150,
                                    accessor: "date_checked_out",
                                },
                                {
                                    Header: "Due Date",
                                    accessor: "date_due",
                                    minWidth: 150,
                                },
                                {
                                    Header: "Officer Out",
                                    accessor: "officer_out",
                                    minWidth: 70,
                                },
                            ]
                        }
                    ]}
                    className="-striped -highlight"
                />
            );
        else
            jsx = <LinearIndeterminate />;

        return (
            <div style={{marginBottom: '12vh', height: '100%', }}>
                {jsx}
            </div>
        );
    }
}

export default CheckoutTable;