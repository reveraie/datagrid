import { DataGrid } from "@reveraie/datagrid";

import '@reveraie/datagrid/dist/index.css';

function Example1() {

    const columns = [{
        name: 'Column 1',
        width: 100
    }, {
        name: 'Column 2',
        width: 200
    }];
    // return (<div>Example 1</div>)
    return (<DataGrid style={{ width: '400px', height: '400px' }} columns={columns} rows={[]} />)
}

export default Example1;