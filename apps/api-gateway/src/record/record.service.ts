import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { recordPatterns } from '@app/contracts/medical-records/records.patterns';
import { RECORD_SERVICE } from '@app/contracts/medical-records/constants';
import { handleRpcError } from '../utils/error-handler.util';
@Injectable()
export class RecordService {
    private readonly logger = new Logger(RecordService.name);

    constructor(
        @Inject(RECORD_SERVICE) private recordClient: ClientProxy,
    ) {}

    async addOrUpdateMedicalRecord(
        patientId: string,
        newEntry: RecordEntryDto
    )
    {
        this.logger.debug(`Creating or updating record for patient: ${patientId}`);
        try {
            const result = await lastValueFrom(
                this.recordClient.send(recordPatterns.CREATE_UPDATE, { patientId, newEntry })
            );
            this.logger.debug('Record creation/update request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to create/update record', error);
            handleRpcError(error, this.logger, 'create/update medical record');
        }
    }

    async findAll(
        doctorId: string,
        page: number = 1,
        pageSize: number = 10
    )
    {
        this.logger.debug(`Finding all records for doctor: ${doctorId}, page: ${page}, pageSize: ${pageSize}`);
        try {
            const result = await lastValueFrom(
                this.recordClient.send(recordPatterns.FIND_ALL, { doctorId, pageSize, page })
            );
            this.logger.debug('Record retrieval request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to retrieve records', error);
            handleRpcError(error, this.logger, 'retrieve medical records');
        }
    }

    async findOne(
        patientId: string,
        requesterId: string
    )
    {
        this.logger.debug(`Finding record for patient: ${patientId}, requested by: ${requesterId}`);
        try {
            const result = await lastValueFrom(
                this.recordClient.send(recordPatterns.FIND_ONE, { patientId, requesterId })
            );
            this.logger.debug('Record retrieval request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to retrieve record', error);
            handleRpcError(error, this.logger, 'retrieve medical record');
        }
    }

    async giveDoctorAuthorizationToAuditRecord(
        doctorId: string,
        patientId: string,
        recordId: string,
        doctorIdToAdd: string
    )
    {
        this.logger.debug(`Giving authorization to doctor: ${doctorIdToAdd} for record: ${recordId}`);
        try {
            const result = await lastValueFrom(
                this.recordClient.send(recordPatterns.GIVE_AUTHORIZATION, { doctorId, patientId, recordId, doctorIdToAdd })
            );
            this.logger.debug('Authorization request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to give authorization', error);
            handleRpcError(error, this.logger, 'give authorization to audit medical record');
        }

    }

    async remove(patientId: string) {
        this.logger.debug(`Removing record for patient: ${patientId}`);
        try {
            const result = await lastValueFrom(
                this.recordClient.send('record.remove', patientId)
            );
            this.logger.debug('Record removal request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to remove record', error);
            handleRpcError(error, this.logger, 'remove medical record');
        }
    }

    

}
