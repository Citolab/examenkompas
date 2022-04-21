import { Examen, ExamenReport, Examenscores, log } from '@examenkompas/data';
import { createStore, StateContext, ActionType } from 'rx-basic-store';
import { environment } from '../../../environments/environment';
import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: `${environment.api}`,
});

export interface StateModel {
  loading: boolean;
  loadingExamen: boolean;
  loadingReport: boolean;
  vakcode?: string;
  vaknaam?: string;
  examens: Examen[];
  selectedExamen: Examen;
  selectedExamenId?: number;
  selectedExamenscoreId: string;
  report: ExamenReport;
  scores: Map<number, number>;
}

const initialState: StateModel = {
  loading: true,
  loadingExamen: true,
  loadingReport: true,
  selectedExamenscoreId: '',
  scores: new Map<number, number>(),
  vakcode: null,
  selectedExamenId: null,
  selectedExamen: null,
  report: null,
  vaknaam: '',
  examens: [],
};

export class InitAction
  implements ActionType<StateModel, { vakcode: string; niveau: string }>
{
  type = 'VAK_INIT_ACTION';
  constructor(public payload: { vakcode: string; niveau: string }) {}

  async execute(ctx: StateContext<StateModel>): Promise<StateModel> {
    const currentState = ctx.getState();
    const { vakcode, niveau } = this.payload;
    let examens: Array<Examen> = [];
    ctx.patchState({ loading: true });
    examens = (
      await instance.get<Examen[]>(`/vak/${vakcode}/niveau/${niveau}/examens`)
    ).data;
    log(
      {
        action: 'INIT_VAK',
        payload: `vak: '${vakcode}' niveau: ${niveau}`,
      },
      instance
    );
    const selectedExamen = currentState.selectedExamen
      ? examens.find((t) => t.examenId === currentState.selectedExamenId)
      : null;
    const vaknaam =
      examens?.find((e) => !!e.vaknaam)?.vaknaam || '- vak onbekend';
    return ctx.patchState({
      loading: false,
      examens: examens,
      selectedExamen,
      vaknaam,
    });
  }
}

export class SelectExamenAction
  implements ActionType<StateModel, { examenId: number }>
{
  type = 'VAK_EXAMEN_SELECT_ACTION';
  constructor(public payload: { examenId: number }) {}

  async execute(ctx: StateContext<StateModel>): Promise<StateModel> {
    ctx.patchState({ loadingExamen: true });
    const { examenId } = this.payload;
    const currentState = ctx.getState();
    let examenscores: Examenscores;
    let report: ExamenReport;
    try {
      log(
        {
          action: 'SELECT_EXAMEN',
          payload: `${examenId}`,
        },
        instance
      );
      examenscores = (
        await instance.get<Examenscores>(`/examen/${examenId}/scores`)
      ).data;
    } catch {
      // not found
    }
    const scoreMap = new Map<number, number>();
    if (examenscores) {
      for (const score of examenscores.scores) {
        scoreMap.set(score.volgnummer, score.score);
      }
    }
    return ctx.patchState({
      selectedExamenId: examenId,
      selectedExamen: currentState.examens.find((t) => t.examenId === examenId),
      scores: scoreMap,
      selectedExamenscoreId: examenscores?.id,
      loadingExamen: false,
      report,
    });
  }
}

export class ShowReportAction implements ActionType<StateModel, never> {
  type = 'VAK_SHOW_REPORT';

  async execute(ctx: StateContext<StateModel>): Promise<StateModel> {
    const state = ctx.getState();
    ctx.patchState({ loadingReport: true });
    log(
      {
        action: 'SHOW_REPORT',
        payload: `scores: ${JSON.stringify(
          state.scores
        )} report:  ${JSON.stringify(ctx.getState().report)}`,
      },
      instance
    );

    const examenscores: Examenscores = {
      id: state.selectedExamenscoreId,
      examenId: state.selectedExamenId,
      submitted: true,
      scores: Array.from(state.scores.entries()).map(([volgnummer, score]) => ({
        score,
        volgnummer,
      })),
    };
    const report = (
      await instance.post<ExamenReport>(`/examen/scores`, examenscores)
    ).data;
    return ctx.patchState({ loadingReport: false, report });
  }
}

export class HideReportAction implements ActionType<StateModel, never> {
  type = 'VAK_HIDE_REPORT';
  async execute(ctx: StateContext<StateModel>): Promise<StateModel> {
    log({ action: 'VAK_HIDE_REPORT', payload: `` }, instance);
    return Promise.resolve(ctx.getState());
  }
}

export class ScoreChangedAction
  implements
    ActionType<
      StateModel,
      {
        changedValue: { itemIdentifier: string; score: number };
        values: Map<number, number>;
      }
    >
{
  type = 'EXAMEN_SCORE_CHANGED_ACTION';

  constructor(
    public payload: {
      changedValue: { itemIdentifier: string; score: number };
      values: Map<number, number>;
    }
  ) {}
  async execute(ctx: StateContext<StateModel>): Promise<StateModel> {
    const { values, changedValue } = this.payload;
    const currentState = ctx.getState();

    const examenscores: Examenscores = {
      id: currentState.selectedExamenscoreId,
      examenId: currentState.selectedExamenId,
      submitted: false,
      scores: Array.from(values.entries()).map(([volgnummer, score]) => ({
        score,
        volgnummer,
      })),
    };
    log(
      {
        action: 'EXAMEN_SCORE_CHANGED',
        payload: changedValue ? JSON.stringify(changedValue) : '',
      },
      instance
    );
    instance.post<ExamenReport>(`/examen/scores`, examenscores);
    return ctx.patchState({ scores: values });
  }
}

const store = createStore<StateModel>(initialState, !environment.production);
export default store;
