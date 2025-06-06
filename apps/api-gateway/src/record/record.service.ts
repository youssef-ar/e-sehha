import { RecordEntryDto } from '@app/contracts/medical-records/record-entry.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { recordPatterns } from '@app/contracts/medical-records/records.patterns';
import { RECORD_SERVICE } from '@app/contracts/medical-records/constants';
import { handleRpcError } from '../utils/error-handler.util';
import { UsersService } from '../users/users.service';

@Injectable()
export class RecordService {
    private readonly logger = new Logger(RecordService.name);

    constructor(
        @Inject(RECORD_SERVICE) private readonly recordClient: ClientProxy,
        @Inject(UsersService) private readonly usersService: UsersService
    ) {}

    async addOrUpdateMedicalRecord(
        patientId: string,
        newEntry: RecordEntryDto
    ) {
        try {
            await this.isPatientIdValid(patientId);
        } catch (error) {
            this.logger.error(`Invalid patient ID: ${patientId}`, error);
            throw new Error(`Invalid patient ID: ${patientId}`);
        }

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
    ) {
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
    ) {
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

    async updateRecordEntry(
        patientId: string,
        recordId: string,
        newEntry: RecordEntryDto
    ) {
        this.logger.debug(`Updating record entry for patient: ${patientId}, recordId: ${recordId}`);
        try {
            const result = await lastValueFrom(
                this.recordClient.send(recordPatterns.UPDATE_RECORD, { patientId, recordId, newEntry })
            );
            this.logger.debug('Record entry update request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to update record entry', error);
            handleRpcError(error, this.logger, 'update medical record entry');
        }
    }

    async giveDoctorAuthorizationToAuditRecord(
        doctorId: string,
        patientId: string,
        recordId: string,
        doctorIdToAdd: string
    ) {
        try {
            await this.isPatientIdValid(patientId);
        } catch (error) {
            this.logger.error(`Invalid patient ID: ${patientId}`, error);
            throw new Error(`Invalid patient ID: ${patientId}`);
        }

        this.logger.debug(`Giving authorization to doctor: ${doctorIdToAdd} for record: ${recordId}`);
        try {
            const result = await lastValueFrom(
                this.recordClient.send(recordPatterns.GIVE_AUTHORIZATION, {
                    doctorId, patientId, recordId, doctorIdToAdd
                })
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
                this.recordClient.send(recordPatterns.REMOVE, patientId)  // Use pattern constant if defined
            );
            this.logger.debug('Record removal request processed successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to remove record', error);
            handleRpcError(error, this.logger, 'remove medical record');
        }
    }

    async isPatientIdValid(patientId: string) {
        this.logger.debug(`Validating patient ID: ${patientId}`);
        try {
            const result = await this.usersService.getUserById(patientId);
            if (!result) {
                this.logger.warn(`Patient ID ${patientId} is not valid`);
                throw new Error(`Patient ID ${patientId} is not valid`);
            }
            this.logger.debug(`Patient ID ${patientId} is valid`);
            return true;
        } catch (error) {
            this.logger.error('Failed to validate patient ID', error);
            handleRpcError(error, this.logger, 'validate patient ID');
        }
    }

    async isDoctorIdValid(doctorId: string) {
        this.logger.debug(`Validating doctor ID: ${doctorId}`);
        try {
            const result = await this.usersService.getUserById(doctorId);
            if (!result) {
                this.logger.warn(`Doctor ID ${doctorId} is not valid`);
                throw new Error(`Doctor ID ${doctorId} is not valid`);
            }
            if (result.role !== 'DOCTOR') {
                this.logger.warn(`User ID ${doctorId} is not a doctor`);
                throw new Error(`User ID ${doctorId} is not a doctor`);
            }
            this.logger.debug(`Doctor ID ${doctorId} is valid`);
            return true;
        } catch (error) {
            this.logger.error('Failed to validate doctor ID', error);
            handleRpcError(error, this.logger, 'validate doctor ID');
        }
    }
}
