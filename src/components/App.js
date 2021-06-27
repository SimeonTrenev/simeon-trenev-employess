import React, { Component } from "react";
import DataGrid from "./DataGrid";
import moment from "moment";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
    };
  }



  crateUniqueEmploies = (splittedText) => {
    const uniqueIds = [];
    const employees = [];

    for (let elements of splittedText) {
      let isUniqueId = false;
      const currentRow = elements.split(", ");
      const employeeId = currentRow[0];
      const projectId = currentRow[1];
      const startDate = currentRow[2];
      let endDate = currentRow[3];

      if (endDate === "NULL") {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();

        today = yyyy + "-" + mm + "-" + dd;

        endDate = today;
      }

      if (!uniqueIds.includes(employeeId)) {
        uniqueIds.push(employeeId);
        isUniqueId = true;
      }

      if (isUniqueId) {
        const emp = {
          employeeId,
          projects: [
            {
              projectId,
              myWokingDates: {
                startDate,
                endDate,
              },
            },
          ],
          employees: [],
        };
        employees.push(emp);
      }
    }
    // console.log(employees);
    this.setState({ employees });
  };

  setUniqueProjectsByEmployee = (splittedText) => {
    for (let elements of splittedText) {
      const currentRow = elements.split(", ");
      const employeeId = currentRow[0];
      const projectId = currentRow[1];
      const startDate = currentRow[2];
      let endDate = currentRow[3];

      if (endDate === "NULL") {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();

        today = yyyy + "-" + mm + "-" + dd;

        endDate = today;
      }

      const updatedEmployees = this.state.employees.map((emp) => {
        let hasThisId = true;
        const currentEmpID = emp.employeeId;

        if (currentEmpID === employeeId) {
          emp.projects.forEach((currentProject) => {
            if (currentProject.projectId !== projectId) {
              hasThisId = false;
            }
          });
        }

        if (!hasThisId) {
          emp.projects.push({
            projectId,
            myWokingDates: { startDate, endDate },
          });
        }
        return emp;
      });

      this.setState({ employees: updatedEmployees });
    }

    // console.log(this.state);
  };

  checkWorkingTogetherEmployee = () => {
    // for(let elements of this.state.employees){
    //   console.log(elements)
    //  console.log(elements.employeeId)

    //  elements.projects.map(currentProject => {
    //    console.log(currentProject)
    //  })

    // }
    for (let i = 0; i < this.state.employees.length; i++) {
      if (i === this.state.employees.length - 1) {
        break;
      }

      const firstEmpStartDate = this.state.employees[i].projects[0]
        .myWokingDates.startDate;
      const firstEmpEndDate = this.state.employees[i].projects[0].myWokingDates
        .endDate;

      const secondEmpStartDate = this.state.employees[i + 1].projects[0]
        .myWokingDates.startDate;
      const secondEmpEndDate = this.state.employees[i + 1].projects[0]
        .myWokingDates.endDate;

      const currentProjectId = this.state.employees[i].projects.map(
        (x) => x.projectId
      );
      const nextProjectId = this.state.employees[i + 1].projects.map(
        (x) => x.projectId
      );

      if (currentProjectId.length >= nextProjectId.length) {
        for (let i = 0; i < currentProjectId.length; i++) {
          if (currentProjectId.includes(nextProjectId[i])) {
            if (
              moment(secondEmpStartDate).isSameOrBefore(firstEmpEndDate) &&
              moment(firstEmpStartDate).isSameOrBefore(secondEmpEndDate)
            ) {
              this.state.employees[i].employees.push({
               employeeId: this.state.employees[i + 1].employeeId,
               projectId : this.state.employees[i + 1].projects[0].projectId,
               workingDays : this.state.employees[i + 1].projects[0].myWokingDates.startDate
              }
              );
            }
            //      console.log(firstEmpStartDate)
            // console.log(firstEmpEndDate)
            // console.log(secondEmpStartDate)
            // console.log(secondEmpEndDate)
          }
        }
      }

      // console.log(this.state.employees[i].projects)
      // console.log(this.state.employees[i + 1].projects)

      // console.log(this.state)
      // console.log(this.state)
    }
  };

  showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const splittedText = text.split("\r\n");
      this.crateUniqueEmploies(splittedText);
      alert(text);
      this.setUniqueProjectsByEmployee(splittedText);
      this.checkWorkingTogetherEmployee();
    };
    reader.readAsText(e.target.files[0]);
  };

  render() {
    const firstCurrentEmployer = this.state.employees.map(
      (currEmp) => currEmp.employeeId
    )[0];
    const secondCurrentEmployer = this.state.employees.map(
      (currEmp) => currEmp.employeeId
    )[1];
   
    // this.state.employees.forEach(emp => console.log(emp.employees))
    // console.log(this.state.employees[0]?.employees[0]);
    // console.log(this.state.employees);
    return (
      <div>
        <input type="file" onChange={(e) => this.showFile(e)} />
        <DataGrid
          employeeId1={firstCurrentEmployer}
          employeeId2={secondCurrentEmployer}
          projectId={this.state.projectId}
          daysWorked={this.state.daysWorked}
        />
      </div>
    );
  };
}

export default App;
