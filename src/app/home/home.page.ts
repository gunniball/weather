import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('lineCanvas', null) lineCanvas: ElementRef;

  public lineChart: Chart;
  city = 'Mykolaiv';
  url = '';
  responseList: any = [];
  totalWeatherPages = 0;
  weatherPage = 0;
  viewDate = '';
  weatherMap: any = [];
  viewPage = {
    city: '',
    date: '',
    temp: '',
    image: ``,
    charts: {
      time: [],
      temp: [],
      humidity: []
    }
  };
  show = false;
  ////////////////////////////////////////////
  constructor(public http: HttpClient) {}
  ////////////////////////////////////////////
  recieveWeather() {
    if (this.city === '') {
      return;
    }
    this.url = `http://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=4b8151c8aacd8ec56df9c10862bd1ddc`;
    console.log(this.url);
    this.http.get(this.url, {})
    .subscribe(data => {
      const anyData = data as any;
      this.responseList = anyData.list;
      this.weatherMap = [];
      this.viewDate = '';
      this.aggregateList();
    }, error => {
      console.error('recieveWeather() http error: ', error);
    });
  }
  ////////////////////////////////////////////
  aggregateList() {
    let dateTime = [], dayStatEnd = false;
    let statObj = null;
    this.show = true;
    for (const hourStat of this.responseList) {
      dayStatEnd = false;
      dateTime = hourStat.dt_txt.split(' ');
      if (dateTime[0] !== this.viewDate) {
        if (this.viewDate !== '') {
          this.weatherMap.push(statObj);
        }
        statObj = {
          city: '',
          date: '',
          temp: '',
          image: `https://openweathermap.org/img/wn/${hourStat.weather[0].icon}@2x.png`,
          charts: {
            time: [],
            temp: [],
            humidity: []
          }
        };
        this.viewDate = statObj.date = dateTime[0];
        const temp = Math.round(hourStat.main.temp - 273);
        if (temp > 0) {
          statObj.temp = '+' + temp;
        } else if (temp === 0) {
          statObj.temp = '-' + temp;
        } else {
          statObj.temp = temp;
        }
        statObj.city = this.city;
      }
      dateTime = dateTime[1].split(':');
      statObj.charts.time.push(dateTime[0] + ':' + dateTime[1]);
      statObj.charts.temp.push(Math.round(hourStat.main.temp - 273));
      statObj.charts.humidity.push(hourStat.main.humidity);
    }
    if (statObj) {
      this.weatherMap.push(statObj);
      this.responseList = [];
      this.viewPage = this.weatherMap[this.weatherPage];
      this.totalWeatherPages = this.weatherMap.length;
      console.log(this.weatherMap);
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: this.viewPage.charts.time,
          datasets: [
            {
              label: 'Temp',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              data: this.viewPage.charts.temp,
              spanGaps: true
            },
            {
              label: 'Humidity',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,156,102,0.4)',
              borderColor: 'rgba(75,156,102,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,156,102,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,156,102,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              data: this.viewPage.charts.humidity,
              spanGaps: true
            }
          ]
        }
      });
    }
  }
  //////////////////////////////////////////////////
  changePage(direction) {
    if (direction === 'left') {
      if (this.weatherPage === 0) {
        this.weatherPage = this.totalWeatherPages - 1;
      } else {
        this.weatherPage--;
      }
    } else {
      if (this.weatherPage === this.totalWeatherPages - 1) {
        this.weatherPage = 0;
      } else {
        this.weatherPage++;
      }
    }
    console.log(this.weatherPage, this.totalWeatherPages);
    this.viewPage = this.weatherMap[this.weatherPage];
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.viewPage.charts.time,
        datasets: [
          {
            label: 'Temp',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            data: this.viewPage.charts.temp,
            spanGaps: true
          },
          {
            label: 'Humidity',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,156,102,0.4)',
            borderColor: 'rgba(75,156,102,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,156,102,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,156,102,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            data: this.viewPage.charts.humidity,
            spanGaps: true
          }
        ]
      }
    });
  }
}
