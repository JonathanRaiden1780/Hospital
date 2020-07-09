import { Component,ChangeDetectionStrategy,ViewChild,TemplateRef} from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {  } from "flatpickr/dist";
import { HistorialService } from 'src/app/services/historial.service';
import { data, map } from 'jquery';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { PacienteInterface } from 'src/app/interfaces/paciente';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-citas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent {
  @ViewChild('addnew', { static: true }) addnew: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  
    view: CalendarView = CalendarView.Month;
  
    CalendarView = CalendarView;
  
    viewDate: Date = new Date();
  
    modalData: {
      action: string;
      event: CalendarEvent;
      fech : string;
      detalles: string;
    };
  
    actions: CalendarEventAction[] = [
      {
        label: '<i class="fas fa-fw fa-trash-alt"></i>',
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          if(confirm('Seguro que desea eliminar la Cita?')){
            
            this.hservice.delete(event)
          }
          //this.handleEvent('Deleted', event);
        },
      },
    ];
  
    refresh: Subject<any> = new Subject();
  
    events: CalendarEvent[] = [
      
    ];
    valadd:CalendarEvent[] = [
      {
        start: subDays(startOfDay(new Date()), 1),
        end: addDays(new Date(), 1),
        title: ' ',
        color: colors.red,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      }
    ];
  
    activeDayIsOpen: boolean = true;
  
    constructor(private modal: NgbModal,private afs: AngularFirestore , private hservice: HistorialService) {
      var numpacientes = 0
      hservice.getAll().subscribe( x => {numpacientes = x.length, this.getresult(x,numpacientes)});
    }
    getresult(x,num){
     for(var i=0 ; i<num ; i++){
      
      const coloress: any = {
        colfb: x[i].color
      };
      var startfb = new Date(x[i].fecha)
      var datapaciente: CalendarEvent []= [
        {
          start: startfb,
          detalles: x[i].detalles,
          end: startfb,
          title: x[i].title,
          color: coloress.colfb,
          actions: this.actions,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        }
      ];
      this.events[i]=  datapaciente[0]
      this.refresh.next()
     }
    }
  
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
        this.viewDate = date;
      }
    }
  
    eventTimesChanged({
      event,
      newStart,
      newEnd,
    }: CalendarEventTimesChangedEvent): void {
      this.events = this.events.map((iEvent) => {
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd,
          };
        }
        return iEvent;
      });
      this.handleEvent('Dropped or resized', event);
    }
    listado: PacienteInterface;
    handleEvent(action: string, event: CalendarEvent): void {
      var fecha = event.start.toString()
      var fech :string  = fecha.slice(0,24)
      var detalles : string = event.detalles
      this.modalData = { event, action, fech, detalles };
      this.modal.open(this.modalContent, { size: 'lg' });
     this.afs.collection('Pacientes').doc(event.title).valueChanges().pipe((take(1))).subscribe(querys => {
       this.detalles(querys as any)
     })
    }
    detalles(x: PacienteInterface){
        this.listado = x;
    }
  
    addEvent(): void {
      this.modal.open(this.addnew)
    }
    
    guardar(event: CalendarEvent){
      var fecha = event.start.toString()
      this.hservice.validarcitas(event,fecha);
    }
  
    deleteEvent(eventToDelete: CalendarEvent) {
      this.events = this.events.filter((event) => event !== eventToDelete);
    }
    
  
    setView(view: CalendarView) {
      this.view = view;
    }
  
    closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;
    }
  }