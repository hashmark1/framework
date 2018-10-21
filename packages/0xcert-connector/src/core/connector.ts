import { FolderCheckAbilityRecipe, FolderCheckTransferStateRecipe, FolderReadCapabilitiesRecipe,
  FolderReadMetadataRecipe, FolderReadSupplyRecipe, FolderCheckAbilityQuery,
  FolderCheckTransferStateQuery, FolderReadCapabilitiesQuery, FolderReadMetadataQuery,
  FolderReadSupplyQuery, FolderCheckApprovalRecipe, FolderCheckApprovalQuery} from './query';
import { FolderSetTransferStateRecipe, FolderSetTransferStateMutation } from './mutation';

/**
 * 
 */
export interface ConnectorBase {
  createQuery(recipe: FolderCheckAbilityRecipe): FolderCheckAbilityQuery;
  createQuery(recipe: FolderCheckApprovalRecipe): FolderCheckApprovalQuery;
  createQuery(recipe: FolderCheckTransferStateRecipe): FolderCheckTransferStateQuery;
  createQuery(recipe: FolderReadCapabilitiesRecipe): FolderReadCapabilitiesQuery;
  createQuery(recipe: FolderReadMetadataRecipe): FolderReadMetadataQuery;
  createQuery(recipe: FolderReadSupplyRecipe): FolderReadSupplyQuery;
  createMutation(recipe: FolderSetTransferStateRecipe): FolderSetTransferStateMutation;
}
