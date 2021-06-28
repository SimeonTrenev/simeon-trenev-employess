import React, { Component } from "react";
import DataGrid from "./DataGrid";
import moment from "moment";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      commonProjects : '',
      commonWorkingDays : ''
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

   
  };

  checkWorkingTogetherEmployee = () => {
  
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

             let startDates = [firstEmpStartDate, secondEmpStartDate];
             startDates.sort((a, b) => b.localeCompare(a));

             let endDates = [firstEmpEndDate, secondEmpEndDate];
             endDates.sort((a, b) => a.localeCompare(b));

          
             let startingDay = moment(startDates[0])
             let endDay = moment(endDates[0])

             const days = endDay.diff(startingDay, 'days')
             

              this.state.employees[i].employees.push({
               employeeId: this.state.employees[i + 1].employeeId,
               projectId : this.state.employees[i + 1].projects[0].projectId,
               workingDays : days
              }
              );
            }
     
          }
        }
      }

      
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
      const currentProjId = this.state.employees.map(curr => curr.employees)
      const togetherWorkingDays = currentProjId[0].map(curr => curr.workingDays)
      const togetherWorkingProjects = currentProjId[0].map(curr => curr.projectId)

      this.setState({commonProjects : togetherWorkingProjects, commonWorkingDays: togetherWorkingDays})
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


    return (
      <div>
        <input type="file" onChange={(e) => this.showFile(e)} />
        <DataGrid
          employeeId1={firstCurrentEmployer}
          employeeId2={secondCurrentEmployer}
          projectId={this.state.commonProjects}
          daysWorked={this.state.commonWorkingDays}
        />
      </div>
    );
  };
}

export default App;
