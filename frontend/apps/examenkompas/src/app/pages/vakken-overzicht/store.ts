import {
  ClustersPerNiveau,
  log,
  opleidingsniveauLeerwegOmschrijving,
  OpleidingsniveauType,
} from '@examenkompas/data';
import { createStore, StateContext, ActionType } from 'rx-basic-store';
import { clustersPerNiveau as dummyData } from '@examenkompas/ui';
import { environment } from '../../../environments/environment';
import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: `${environment.api}`,
});

export interface StateModel {
  loading: boolean;
  clustersPerNiveau: ClustersPerNiveau[];
  selectedOpleidingsNiveau?: OpleidingsniveauType;
}
const initialState: StateModel = {
  loading: true,
  clustersPerNiveau: [],
  selectedOpleidingsNiveau: null, // OpleidingsniveauType.VO_VMBO,
};

export class InitAction
  implements ActionType<StateModel, { scores: Map<number, number> }>
{
  type = 'VAKKEN_OVERZICHT_INIT';

  constructor(public opleidingsniveau?: OpleidingsniveauType) {}

  async execute(ctx: StateContext<StateModel>): Promise<StateModel> {
    if (ctx.getState().clustersPerNiveau?.length === 0) {
      log(
        {
          action: 'INIT_VAKKENOVERZICHT',
          payload: opleidingsniveauLeerwegOmschrijving(
            this.opleidingsniveau || OpleidingsniveauType.VO_VMBO
          ),
        },
        instance
      );
      if (environment.useBackend) {
        ctx.patchState({ loading: true });
        const clustersPerNiveau = (
          await axios.get<ClustersPerNiveau[]>(
            `${environment.api}/Vak/clustersperniveau`
          )
        ).data;

        return ctx.patchState({
          loading: false,
          clustersPerNiveau,
          selectedOpleidingsNiveau: this.opleidingsniveau,
        });
      } else {
        return ctx.patchState({
          loading: false,
          clustersPerNiveau: dummyData,
          selectedOpleidingsNiveau: this.opleidingsniveau,
        });
      }
    }
    return ctx.patchState({
      loading: false,
      selectedOpleidingsNiveau: this.opleidingsniveau,
    });
  }
}

const store = createStore<StateModel>(initialState, !environment.production);
export default store;
