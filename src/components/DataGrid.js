import { Component } from "react";

class DataGrid extends Component {
  render() {
    const { employeeId1, employeeId2, projectId, daysWorked } = this.props;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Employee ID #1</th>
              <th>Employee ID #2</th>
              <th>Project ID</th>
              <th>Days worked</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{employeeId1}</td>
              <td>{employeeId2}</td>
              <td>{projectId}</td>
              <td>{daysWorked}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataGrid;
