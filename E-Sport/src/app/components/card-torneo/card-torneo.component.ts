import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Torneo } from '../../models/torneo.model';

@Component({
  selector: 'app-card-torneo',
  imports: [DatePipe, RouterLink],
  templateUrl: './card-torneo.component.html',
  styleUrl: './card-torneo.component.css',
})
export class CardTorneoComponent {
  torneo = input.required<Torneo>();
  posizione = input<number | null>(null);

  sfondo = computed(() => {
    const foto = this.torneo().foto;
    return foto ? `url('${foto}')` : null;
  });

  etichettaModalita = computed(() => {
    const t = this.torneo();
    switch (t.modalita) {
      case 'SINGOLO':
        return 'Singolo';
      case 'DUO':
        return 'Duo';
      default:
        return `Squadra (${t.giocatoriPerSquadra})`;
    }
  });

  etichettaStato = computed(() => {
    const t = this.torneo();
    if (t.stato === 'CONCLUSO') return 'Concluso';
    if (t.inCorso) return 'In corso';
    return t.stato === 'APERTO' ? 'Aperto' : 'Chiuso';
  });

  classeStato = computed(() => {
    const t = this.torneo();
    if (t.stato === 'CONCLUSO') return 'badge concluso';
    if (t.inCorso) return 'badge in-corso';
    return t.stato === 'APERTO' ? 'badge aperto' : 'badge chiuso';
  });

  etichettaPulsante = computed(() => {
    const t = this.torneo();
    if (t.stato === 'CONCLUSO') return 'Vedi risultati';
    return t.inCorso ? 'Vedi partite' : 'Dettaglio torneo';
  });
}
