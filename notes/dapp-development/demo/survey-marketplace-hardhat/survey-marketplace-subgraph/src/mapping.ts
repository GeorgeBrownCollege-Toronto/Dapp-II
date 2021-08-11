import {
  OwnershipTransferred as OwnershipTransferredEvent,
  SurveyCreated as SurveyCreatedEvent,
  SurveyFactoryInitialized as SurveyFactoryInitializedEvent,
} from "../generated/SurveyFactory/SurveyFactory";
import { OwnershipTransferred, SurveyCreated, SurveyFactoryInitialized } from "../generated/schema";

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;
  entity.save();
}

export function handleSurveyCreated(event: SurveyCreatedEvent): void {
  let entity = new SurveyCreated(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.owner = event.params.owner;
  entity.surveyId = event.params.surveyId;
  entity.surveyAddress = event.params.surveyAddress;
  entity.createdAtTimeStamp = event.block.timestamp;
  entity.createdAtBlock = event.block.number;
  entity.save();
}

export function handleSurveyFactoryInitialized(event: SurveyFactoryInitializedEvent): void {
  let entity = new SurveyFactoryInitialized(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.surveyCreationFees = event.params.surveyCreationFees;
  entity.save();
}
