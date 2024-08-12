import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Dashboard } from 'src/app/Model/dashboard';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any;
  constructor(private Service: DashboardService) {}
  ngOnInit() {
    this.Service.getDashboardData().subscribe(data => {
      this.dashboardData = data;
       this.createChart();
       this.attendanceChart(data);
       this.lateAttendanceChart(data);
    });
  }
  
  createChart() {
    this.Service.getDashboardData().subscribe((dashboard: Dashboard) => {
      const maleLabel = 'نسبة الذكور ';
      const femaleLabel = "نسبة الاناث ";
      const maleData = [dashboard.genderPercentage.Male];
      const femaleData = [dashboard.genderPercentage.Female];
      const maleBorderColor = ['transparent'];
      const femaleBorderColor = ['transparent'];
   
  
      const maleChart = new Chart("MaleChart", {
        type: 'doughnut',
        data: {
          labels: [maleLabel],
          datasets: [
            {
              label: "نسبة الذكور ",
              data: [100 - maleData[0], maleData[0]],
              backgroundColor: ['#eeeeee', '#015e87'],
              borderColor: maleBorderColor,
            },
          ]
        },
        options: {
          aspectRatio: 3.5,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#015e87' ,
                font: {
                  size: 16 // Change the label font size here
                },
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return '%'+ maleLabel + ': ' + maleData[0];
                }
              }
            }
          }
        }
      });
  
      const femaleChart = new Chart("FemaleChart", {
        type: 'doughnut',
        data: {
          labels: [femaleLabel],
          datasets: [
            {
              label: "نسبة الاناث ",
              data: [100 - femaleData[0], femaleData[0]],
              backgroundColor: ['#eeeeee', 'rgb(233, 143, 158)'],
              borderColor: femaleBorderColor,
            },
          ]
        },
        options: {
          aspectRatio: 3.5,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: 'rgb(233, 143, 158)' ,
                font: {
                  size: 16
                  },
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return  '%'+femaleLabel + ': ' + femaleData[0] ;
                }
              }
            }
          }
        }
      });
  
    });
  }
  attendanceChart(data: Dashboard) {
    // const labelData = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'السبت'];
    const labelData = Object.keys(data.dailyAttendanceRatio).map(date => {
      const dayOfWeek = new Date(date).toLocaleDateString('ar-EG', { weekday: 'long' });
      return dayOfWeek;
  });
    const realData = Object.values(data.dailyAttendanceRatio);
    const colorData = ['#f5835f', '#c5c4c4', '#015e87', 'orange', 'purple'];
  
    const attendenceChart = new Chart('AttendenceChart', {
      type: 'bar',
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'نسبة الحضور',
            data: realData,
            backgroundColor: colorData,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label +=  '%'+ context.parsed.y ; 
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              align: 'center',
              font: {
                size: 14 
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 14 
              }
            }
          }
        },
      },
    });
  }
  lateAttendanceChart(data: Dashboard) {
    // const labelData = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'السبت'];
    const labelData = Object.keys(data.dailyLateAttendanceCount).map(date => {
      const dayOfWeek = new Date(date).toLocaleDateString('ar-EG', { weekday: 'long' });
      return dayOfWeek;
  });
    const realData = Object.values(data.dailyLateAttendanceCount);
    const colorData = ['#f5835f', '#c5c4c4', '#015e87', '#E178C5', '#A5DD9B'];
  
    const lateAttendanceChart = new Chart('LateAttendenceChart', {
      type: 'bar',
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'عدد المتأخرين في الحضور',
            data: realData,
            backgroundColor: colorData,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16
              }
            }
          },
        },
        scales: {
          x: {
            ticks: {
              align: 'center',
              font: {
                size: 14 
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 14 
              }
            }
          }
        },
      },
    });
  }
}