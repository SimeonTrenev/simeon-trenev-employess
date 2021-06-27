import { Component } from "react";
import './DataGrid.css';

class DataGrid extends Component {
  render() {
    const { employeeId1, employeeId2, projectId, daysWorked } = this.props;
    return (
      <table className="ui celled table">
      <thead className="thead">
        <tr><th>Employee ID #1</th>
        <th>Employee ID #2</th>
        <th>Project ID</th>
        <th>Days worked</th>
      </tr></thead>
      <tbody>
        <tr className="tr">
          <td data-label="Employee ID #1">{employeeId1}</td>
          <td data-label="Employee ID #2">{employeeId2}</td>
          <td data-label="Project ID">{projectId}</td>
          <td data-label="Days worked">{daysWorked}</td>
        </tr>
      </tbody>
    </table>
    );
  }
}

export default DataGrid;


