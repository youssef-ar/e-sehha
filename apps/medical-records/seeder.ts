// seeder.ts
import { connect, model, Schema } from 'mongoose';

async function seed() {
  await connect('mongodb://localhost:27017/medical-records');

  const MedicalRecordSchema = new Schema({
    patientId: { type: String, required: true },
    records: [
      {
        doctorId: { type: String, required: true },
        diagnosis: { type: String },
        treatment: { type: String },
        prescription: { type: String },
        createdAt: { type: Date, default: Date.now },
      }
    ],
  });

  const MedicalRecord = model('MedicalRecord', MedicalRecordSchema);

  const dummyPatientId = 'd8e2a962-1a23-4f55-90aa-cd18e1b12345';
  const dummyDoctorId = 'bdc04a6b-b689-4a29-8aa3-cba0a1e12345';

  await MedicalRecord.create({
    patientId: dummyPatientId,
    records: [
      {
        doctorId: dummyDoctorId,
        diagnosis: 'Initial Diagnosis',
        treatment: 'Initial Treatment',
        prescription: 'Initial Prescription'
      }
    ]
  });

  console.log('✅ Dummy Medical Record created.');
  process.exit(0);
}

seed();


