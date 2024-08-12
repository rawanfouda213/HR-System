export interface Dashboard {
    numberOfEmployees: number;
    numberOfDepartments: number;
    averageSalary: number;
    genderPercentage: {
      Male: number;
      Female: number;
    };
    dailyAttendanceRatio: {
      [date: string]: number;
    };
    dailyLateAttendanceCount: {
      [date: string]: number;
    };
  }