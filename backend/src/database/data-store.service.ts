import { Injectable } from '@nestjs/common';

export const TENANT_A_ID = '11111111-1111-1111-1111-111111111111';
export const TENANT_B_ID = '22222222-2222-2222-2222-222222222222';

@Injectable()
export class DataStoreService {
  private tenants = [
    {
      id: TENANT_A_ID,
      name: 'Acme Technologies Inc.',
      code: 'ACME',
      domain: 'acme.cubeai.internal',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: TENANT_B_ID,
      name: 'Globex Corp',
      code: 'GLOBEX',
      domain: 'globex.cubeai.internal',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ];

  private users = [
    {
      id: 'u-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      email: 'hr.admin@acme.cubeai.internal',
      password_hash: '$2b$10$epNz4zB39W7cQWlP6sJ3UuYcZ99yqDk6N5pZ8qGqE3uO0W4eK2', // Password@123
      roles: ['HR_ADMIN'],
      is_active: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'u-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      email: 'john.doe@acme.cubeai.internal',
      password_hash: '$2b$10$epNz4zB39W7cQWlP6sJ3UuYcZ99yqDk6N5pZ8qGqE3uO0W4eK2',
      roles: ['EMPLOYEE'],
      is_active: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'u-11111111-1111-1111-1111-111111111113',
      tenant_id: TENANT_A_ID,
      email: 'sarah.manager@acme.cubeai.internal',
      password_hash: '$2b$10$epNz4zB39W7cQWlP6sJ3UuYcZ99yqDk6N5pZ8qGqE3uO0W4eK2',
      roles: ['LINE_MANAGER'],
      is_active: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'u-22222222-2222-2222-2222-222222222221',
      tenant_id: TENANT_B_ID,
      email: 'hr.admin@globex.cubeai.internal',
      password_hash: '$2b$10$epNz4zB39W7cQWlP6sJ3UuYcZ99yqDk6N5pZ8qGqE3uO0W4eK2',
      roles: ['HR_ADMIN'],
      is_active: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ];

  private departments: any[] = [
    {
      id: 'd-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      name: 'IT',
      code: 'IT',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      parent_department_id: null,
      lead_employee_id: 'e-11111111-1111-1111-1111-111111111112',
      lead_name: 'Sarah Jenkins',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'd-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      name: 'Marketing',
      code: 'MKT',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      parent_department_id: null,
      lead_employee_id: null,
      lead_name: null,
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'd-11111111-1111-1111-1111-111111111110',
      tenant_id: TENANT_A_ID,
      name: 'Management',
      code: 'MGMT',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      parent_department_id: null,
      lead_employee_id: 'e-11111111-1111-1111-1111-111111111111',
      lead_name: 'David Miller',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'd-11111111-1111-1111-1111-111111111113',
      tenant_id: TENANT_A_ID,
      name: 'HR',
      code: 'HR',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:56 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:56 PM',
      parent_department_id: null,
      lead_employee_id: 'e-11111111-1111-1111-1111-111111111114',
      lead_name: 'Priya Natarajan',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'd-11111111-1111-1111-1111-111111111114',
      tenant_id: TENANT_A_ID,
      name: 'Engineering',
      code: 'ENG',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:56 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:56 PM',
      parent_department_id: null,
      lead_employee_id: 'e-11111111-1111-1111-1111-111111111113',
      lead_name: 'John Doe',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'd-22222222-2222-2222-2222-222222222221',
      tenant_id: TENANT_B_ID,
      name: 'Operations',
      code: 'OPS',
      mail_alias: '',
      added_by: '1 - Admin',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Admin',
      modified_time: '16-Nov-2026 02:58 PM',
      parent_department_id: null,
      lead_employee_id: null,
      lead_name: null,
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ];

  private designations: any[] = [
    {
      id: 'des-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      title: 'Manager',
      code: 'MGR',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      grade_level: 'M1',
      status: 'ACTIVE',
    },
    {
      id: 'des-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      title: 'Administration',
      code: 'ADM',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      department_id: 'd-11111111-1111-1111-1111-111111111110',
      grade_level: 'L3',
      status: 'ACTIVE',
    },
    {
      id: 'des-11111111-1111-1111-1111-111111111110',
      tenant_id: TENANT_A_ID,
      title: 'CEO',
      code: 'CEO',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      department_id: 'd-11111111-1111-1111-1111-111111111110',
      grade_level: 'C-LEVEL',
      status: 'ACTIVE',
    },
    {
      id: 'des-11111111-1111-1111-1111-111111111113',
      tenant_id: TENANT_A_ID,
      title: 'Team Member',
      code: 'TM',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      grade_level: 'L2',
      status: 'ACTIVE',
    },
    {
      id: 'des-11111111-1111-1111-1111-111111111114',
      tenant_id: TENANT_A_ID,
      title: 'Principal Software Engineer',
      code: 'PSE',
      mail_alias: '',
      added_by: '1 - Dhandabani - M',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Dhandabani - M',
      modified_time: '16-Nov-2026 02:58 PM',
      department_id: 'd-11111111-1111-1111-1111-111111111114',
      grade_level: 'L5',
      status: 'ACTIVE',
    },
    {
      id: 'des-22222222-2222-2222-2222-222222222221',
      tenant_id: TENANT_B_ID,
      title: 'Operations Director',
      code: 'OPD',
      mail_alias: '',
      added_by: '1 - Admin',
      added_time: '16-Nov-2026 02:58 PM',
      modified_by: '1 - Admin',
      modified_time: '16-Nov-2026 02:58 PM',
      department_id: 'd-22222222-2222-2222-2222-222222222221',
      grade_level: 'DIR',
      status: 'ACTIVE',
    },
  ];

  private locations: any[] = [
    {
      id: 'loc-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      name: 'Bangalore HQ',
      code: 'BLR',
      city: 'Bangalore',
      country: 'India',
      is_headquarters: true,
    },
    {
      id: 'loc-22222222-2222-2222-2222-222222222221',
      tenant_id: TENANT_B_ID,
      name: 'London Central',
      code: 'LON',
      city: 'London',
      country: 'United Kingdom',
      is_headquarters: true,
    },
  ];

  private employees: any[] = [
    {
      id: 'e-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      user_id: 'u-11111111-1111-1111-1111-111111111111',
      employee_code: 'EMP-10001',
      first_name: 'David',
      last_name: 'Miller',
      work_email: 'david.miller@cubeai.internal',
      personal_email: 'david.miller@gmail.com',
      mobile_phone: '+91 98400 12345',
      gender: 'Male',
      date_of_birth: '1985-04-12',
      joining_date: '2023-01-15',
      department_id: 'd-11111111-1111-1111-1111-111111111110',
      designation_id: 'des-11111111-1111-1111-1111-111111111110',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      reporting_manager_id: null,
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-01-15T00:00:00.000Z',
    },
    {
      id: 'e-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      user_id: 'u-11111111-1111-1111-1111-111111111113',
      employee_code: 'EMP-10002',
      first_name: 'Sarah',
      last_name: 'Jenkins',
      work_email: 'sarah.manager@cubeai.internal',
      personal_email: 'sarah.j@gmail.com',
      mobile_phone: '+91 98400 54321',
      gender: 'Female',
      date_of_birth: '1988-09-21',
      joining_date: '2023-06-01',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111112',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      reporting_manager_id: 'e-11111111-1111-1111-1111-111111111111',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-06-01T00:00:00.000Z',
    },
    {
      id: 'e-11111111-1111-1111-1111-111111111113',
      tenant_id: TENANT_A_ID,
      user_id: 'u-11111111-1111-1111-1111-111111111112',
      employee_code: 'EMP-10003',
      first_name: 'John',
      last_name: 'Doe',
      work_email: 'john.doe@cubeai.internal',
      personal_email: 'john.doe.dev@gmail.com',
      mobile_phone: '+91 98400 98765',
      gender: 'Male',
      date_of_birth: '1995-11-05',
      joining_date: '2024-02-01',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111111',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      reporting_manager_id: 'e-11111111-1111-1111-1111-111111111112',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2024-02-01T00:00:00.000Z',
    },
    {
      id: 'e-11111111-1111-1111-1111-111111111114',
      tenant_id: TENANT_A_ID,
      user_id: 'u-11111111-1111-1111-1111-111111111111',
      employee_code: 'EMP-10004',
      first_name: 'Priya',
      last_name: 'Natarajan',
      work_email: 'priya.n@cubeai.internal',
      personal_email: 'priya.n@gmail.com',
      mobile_phone: '+91 98400 11223',
      gender: 'Female',
      date_of_birth: '1989-08-15',
      joining_date: '2023-03-10',
      department_id: 'd-11111111-1111-1111-1111-111111111112',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      reporting_manager_id: 'e-11111111-1111-1111-1111-111111111111',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-03-10T00:00:00.000Z',
    },
    {
      id: 'e-s20',
      tenant_id: TENANT_A_ID,
      employee_code: 'S20',
      first_name: 'Christopher',
      last_name: 'Brown',
      nick_name: 'Chris',
      work_email: 'christopherbrown@zylker.com',
      personal_email: 'christopherbrown@zylker.com',
      mobile_phone: '+91 98400 20020',
      gender: 'Male',
      date_of_birth: '1984-06-18',
      joining_date: '2023-01-10',
      department_id: 'd-11111111-1111-1111-1111-111111111110',
      designation_id: 'des-11111111-1111-1111-1111-111111111112',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-01-10T00:00:00.000Z',
    },
    {
      id: 'e-s19',
      tenant_id: TENANT_A_ID,
      employee_code: 'S19',
      first_name: 'Michael',
      last_name: 'Johnson',
      nick_name: 'Mike',
      work_email: 'michaeljohnson@zylker.com',
      personal_email: 'michaeljohnson@zylker.com',
      mobile_phone: '+91 98400 19019',
      gender: 'Male',
      date_of_birth: '1986-11-23',
      joining_date: '2023-02-15',
      department_id: 'd-11111111-1111-1111-1111-111111111110',
      designation_id: 'des-11111111-1111-1111-1111-111111111112',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-02-15T00:00:00.000Z',
    },
    {
      id: 'e-s18',
      tenant_id: TENANT_A_ID,
      employee_code: 'S18',
      first_name: 'William',
      last_name: 'Smith',
      nick_name: 'William',
      work_email: 'williamsmith@zylker.com',
      personal_email: 'williamsmith@zylker.com',
      mobile_phone: '+91 98400 18018',
      gender: 'Male',
      date_of_birth: '1991-03-12',
      joining_date: '2023-04-01',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-04-01T00:00:00.000Z',
    },
    {
      id: 'e-s17',
      tenant_id: TENANT_A_ID,
      employee_code: 'S17',
      first_name: 'Amardeep',
      last_name: 'Banjeet',
      nick_name: 'Amardeep',
      work_email: 'amardeepbanjeet@zylker.com',
      personal_email: 'amardeepbanjeet@zylker.com',
      mobile_phone: '+91 98400 17017',
      gender: 'Male',
      date_of_birth: '1993-08-05',
      joining_date: '2023-05-15',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-05-15T00:00:00.000Z',
    },
    {
      id: 'e-s16',
      tenant_id: TENANT_A_ID,
      employee_code: 'S16',
      first_name: 'Andrea',
      last_name: 'Garcia',
      nick_name: 'Andrea',
      work_email: 'andreagarcia@zylker.com',
      personal_email: 'andreagarcia@zylker.com',
      mobile_phone: '+91 98400 16016',
      gender: 'Female',
      date_of_birth: '1992-12-14',
      joining_date: '2023-06-20',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-06-20T00:00:00.000Z',
    },
    {
      id: 'e-s15',
      tenant_id: TENANT_A_ID,
      employee_code: 'S15',
      first_name: 'Aparna',
      last_name: 'Acharya',
      nick_name: 'Aparna',
      work_email: 'aparnaacharya@zylker.com',
      personal_email: 'aparnaacharya@zylker.com',
      mobile_phone: '+91 98400 15015',
      gender: 'Female',
      date_of_birth: '1994-04-28',
      joining_date: '2023-07-10',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-07-10T00:00:00.000Z',
    },
    {
      id: 'e-s14',
      tenant_id: TENANT_A_ID,
      employee_code: 'S14',
      first_name: 'Emily',
      last_name: 'Jones',
      nick_name: 'Emily',
      work_email: 'emilyjones@zylker.com',
      personal_email: 'emilyjones@zylker.com',
      mobile_phone: '+91 98400 14014',
      gender: 'Female',
      date_of_birth: '1996-09-03',
      joining_date: '2023-08-01',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-08-01T00:00:00.000Z',
    },
    {
      id: 'e-s13',
      tenant_id: TENANT_A_ID,
      employee_code: 'S13',
      first_name: 'Isabella',
      last_name: 'Lopez',
      nick_name: 'Isabella',
      work_email: 'isabellalopez@zylker.com',
      personal_email: 'isabellalopez@zylker.com',
      mobile_phone: '+91 98400 13013',
      gender: 'Female',
      date_of_birth: '1997-01-19',
      joining_date: '2023-09-15',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      location_id: 'loc-11111111-1111-1111-1111-111111111111',
      role: 'Team member',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2023-09-15T00:00:00.000Z',
    },
    {
      id: 'e-22222222-2222-2222-2222-222222222221',
      tenant_id: TENANT_B_ID,
      user_id: 'u-22222222-2222-2222-2222-222222222221',
      employee_code: 'EMP-20001',
      first_name: 'Alice',
      last_name: 'Wong',
      work_email: 'hr.admin@globex.cubeai.internal',
      personal_email: 'alice.wong@example.com',
      mobile_phone: '+44 7700 900077',
      gender: 'Female',
      date_of_birth: '1990-07-14',
      joining_date: '2024-01-10',
      department_id: 'd-22222222-2222-2222-2222-222222222221',
      designation_id: 'des-22222222-2222-2222-2222-222222222221',
      location_id: 'loc-22222222-2222-2222-2222-222222222221',
      reporting_manager_id: null,
      employment_status: 'ACTIVE_CONFIRMED',
      created_at: '2024-01-10T00:00:00.000Z',
    },
  ];

  private employeeProfiles: any[] = [
    {
      employee_id: 'e-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      pan_number: 'ABCDE1234F',
      aadhaar_number_masked: 'XXXX-XXXX-9012',
      uan_number: '100987654321',
      bank_name: 'HDFC Bank',
      bank_account_number: '50100234567890',
      bank_ifsc_code: 'HDFC0001234',
      current_address: { city: 'Bangalore', state: 'Karnataka', pincode: '560100' },
      permanent_address: { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
      emergency_contact: { name: 'Mary Miller', relation: 'Spouse', phone: '+91 9840011111' },
    },
    {
      employee_id: 'e-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      pan_number: 'FGHIJ5678K',
      aadhaar_number_masked: 'XXXX-XXXX-3456',
      uan_number: '100987654322',
      bank_name: 'ICICI Bank',
      bank_account_number: '50100987654321',
      bank_ifsc_code: 'ICIC0001234',
      current_address: { city: 'Bangalore', state: 'Karnataka', pincode: '560101' },
      permanent_address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      emergency_contact: { name: 'Tom Jenkins', relation: 'Spouse', phone: '+91 9840022222' },
    },
    {
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      tenant_id: TENANT_A_ID,
      pan_number: 'LMNOP9012Q',
      aadhaar_number_masked: 'XXXX-XXXX-7890',
      uan_number: '100987654323',
      bank_name: 'State Bank of India',
      bank_account_number: '50100112233445',
      bank_ifsc_code: 'SBIN0001234',
      current_address: { city: 'Bangalore', state: 'Karnataka', pincode: '560102' },
      permanent_address: { city: 'Delhi', state: 'Delhi', pincode: '110001' },
      emergency_contact: { name: 'Mary Doe', relation: 'Spouse', phone: '+91 9840033333' },
    },
    {
      employee_id: 'e-11111111-1111-1111-1111-111111111114',
      tenant_id: TENANT_A_ID,
      pan_number: 'RSTUV3456W',
      aadhaar_number_masked: 'XXXX-XXXX-1122',
      uan_number: '100987654324',
      bank_name: 'Axis Bank',
      bank_account_number: '50100998877665',
      bank_ifsc_code: 'UTIB0001234',
      current_address: { city: 'Bangalore', state: 'Karnataka', pincode: '560103' },
      permanent_address: { city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001' },
      emergency_contact: { name: 'Karthik N', relation: 'Spouse', phone: '+91 9840044444' },
    },
  ];

  private candidates: any[] = [
    {
      id: 'c-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      first_name: 'Vikram',
      last_name: 'Rao',
      email: 'vikram.rao@example.com',
      mobile_phone: '+91 9789012345',
      proposed_joining_date: '2026-12-01',
      department_id: 'd-11111111-1111-1111-1111-111111111111',
      designation_id: 'des-11111111-1111-1111-1111-111111111111',
      invitation_token: 'tok-onb-1111-2222-3333',
      status: 'READY_FOR_DAY_ONE',
      converted_employee_id: null,
      created_at: '2026-11-01T10:00:00.000Z',
    },
    {
      id: 'c-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      first_name: 'Ananya',
      last_name: 'Iyer',
      email: 'ananya.iyer@example.com',
      mobile_phone: '+91 9789054321',
      proposed_joining_date: '2026-12-15',
      department_id: 'd-11111111-1111-1111-1111-111111111112',
      designation_id: 'des-11111111-1111-1111-1111-111111111113',
      invitation_token: 'tok-onb-4444-5555-6666',
      status: 'INVITED',
      converted_employee_id: null,
      created_at: '2026-11-10T14:00:00.000Z',
    },
  ];

  private cases = [
    {
      id: 'case-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      case_number: 'CASE-2026-0001',
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      category_id: 'cat-11111111-1111-1111-1111-111111111111',
      subject: 'Clarification regarding medical insurance coverage for dependents',
      description: 'Need to add newborn baby to the group health insurance policy.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assigned_to: 'u-11111111-1111-1111-1111-111111111111',
      response_due_at: '2026-11-18T10:00:00.000Z',
      resolution_due_at: '2026-11-20T18:00:00.000Z',
      first_responded_at: '2026-11-17T09:30:00.000Z',
      created_at: '2026-11-17T09:00:00.000Z',
    },
  ];

  private caseCategories = [
    {
      id: 'cat-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      name: 'Benefits & Insurance',
      code: 'BEN',
      description: 'Queries regarding insurance, mediclaim, wellness benefits',
      is_confidential: false,
    },
    {
      id: 'cat-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      name: 'Payroll & Taxation',
      code: 'PAY',
      description: 'Queries on payslips, Form 16, tax deductions',
      is_confidential: false,
    },
    {
      id: 'cat-11111111-1111-1111-1111-111111111113',
      tenant_id: TENANT_A_ID,
      name: 'Grievance & POSH',
      code: 'POSH',
      description: 'Confidential complaints and workplace ethics',
      is_confidential: true,
    },
  ];

  private caseMessages = [
    {
      id: 'cmsg-1',
      tenant_id: TENANT_A_ID,
      case_id: 'case-11111111-1111-1111-1111-111111111111',
      sender_user_id: 'u-11111111-1111-1111-1111-111111111111',
      is_internal_note: false,
      message: 'Hello John, please provide the birth certificate to initiate endorsement.',
      created_at: '2026-11-17T09:30:00.000Z',
    },
  ];

  private policies = [
    {
      id: 'pol-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      title: 'Information Security & Acceptable Use Policy',
      version: '3.0',
      content: 'All corporate devices and sensitive assets must comply with ISO 27001 standards...',
      effective_from: '2026-01-01',
      is_mandatory: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'pol-11111111-1111-1111-1111-111111111112',
      tenant_id: TENANT_A_ID,
      title: 'Prevention of Sexual Harassment (POSH) Policy',
      version: '2.1',
      content: 'CubeAI Solutions upholds strict zero-tolerance towards workplace harassment...',
      effective_from: '2026-01-01',
      is_mandatory: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ];

  private policyAcknowledgements = [
    {
      id: 'ack-1',
      tenant_id: TENANT_A_ID,
      policy_id: 'pol-11111111-1111-1111-1111-111111111111',
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      acknowledged_at: '2026-02-05T12:00:00.000Z',
      ip_address: '10.0.1.45',
      user_agent: 'Mozilla/5.0 Chrome/131',
    },
  ];

  private employeeDocuments = [
    {
      id: 'doc-1',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      title: 'PAN Card Copy',
      file_url: 'https://vault.cubeai.internal/docs/emp10003_pan.pdf',
      file_type: 'application/pdf',
      expiry_date: null,
      status: 'VERIFIED',
      created_at: '2024-02-01T00:00:00.000Z',
    },
    {
      id: 'doc-2',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      title: 'Passport Copy',
      file_url: 'https://vault.cubeai.internal/docs/emp10003_passport.pdf',
      file_type: 'application/pdf',
      expiry_date: '2026-12-31',
      status: 'VERIFIED',
      created_at: '2024-02-01T00:00:00.000Z',
    },
  ];

  private exitRequests = [
    {
      id: 'exit-11111111-1111-1111-1111-111111111111',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      separation_type: 'VOLUNTARY',
      reason: 'Pursuing higher studies abroad',
      employee_comments: 'Thank you team for the wonderful mentorship.',
      resignation_date: '2026-11-10',
      proposed_last_working_date: '2026-12-10',
      agreed_last_working_date: '2026-12-10',
      notice_period_days: 30,
      notice_shortfall_days: 0,
      status: 'CLEARANCE_IN_PROGRESS',
      created_at: '2026-11-10T09:00:00.000Z',
    },
  ];

  private exitClearanceItems = [
    {
      id: 'noc-1',
      tenant_id: TENANT_A_ID,
      exit_request_id: 'exit-11111111-1111-1111-1111-111111111111',
      department: 'IT',
      item_name: 'MacBook Pro & Security Token Handover',
      status: 'CLEARED',
      hold_reason: null,
      recovery_amount: 0,
    },
    {
      id: 'noc-2',
      tenant_id: TENANT_A_ID,
      exit_request_id: 'exit-11111111-1111-1111-1111-111111111111',
      department: 'ADMIN',
      item_name: 'Access Keycard & Parking Pass Return',
      status: 'PENDING',
      hold_reason: null,
      recovery_amount: 0,
    },
    {
      id: 'noc-3',
      tenant_id: TENANT_A_ID,
      exit_request_id: 'exit-11111111-1111-1111-1111-111111111111',
      department: 'FINANCE',
      item_name: 'Travel Advance & Corporate Card Settlement',
      status: 'PENDING',
      hold_reason: null,
      recovery_amount: 0,
    },
  ];

  private announcements = [
    {
      id: 'ann-1',
      tenant_id: TENANT_A_ID,
      title: 'CubeAI Annual All-Hands & Strategy Summit 2026',
      content: 'We are delighted to welcome all team members to our annual summit on Dec 18th!',
      priority: 'INFO',
      published_by: 'u-11111111-1111-1111-1111-111111111111',
      created_at: '2026-11-15T00:00:00.000Z',
    },
  ];

  private profileRequests: any[] = [];
  private delegations: any[] = [];
  private customFieldDefinitions: any[] = [
    {
      id: 'cfd-1',
      tenant_id: TENANT_A_ID,
      field_label: 'Corporate T-Shirt Size',
      field_name: 'tshirt_size',
      field_type: 'DROPDOWN',
      section_id: 'personal-info',
      is_required: false,
      is_active: true,
      is_visible_to_employee: true,
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      display_order: 1,
    },
    {
      id: 'cfd-2',
      tenant_id: TENANT_A_ID,
      field_label: 'LinkedIn Profile URL',
      field_name: 'linkedin_url',
      field_type: 'URL',
      section_id: 'work-details',
      is_required: false,
      is_active: true,
      is_visible_to_employee: true,
      options: null,
      display_order: 2,
    },
  ];
  private customFieldValues: any[] = [
    {
      id: 'cfv-1',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      field_id: 'cfd-1',
      value_text: 'L (Large)',
      value_json: null,
    },
    {
      id: 'cfv-2',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      field_id: 'cfd-2',
      value_text: 'https://linkedin.com/in/johndoe',
      value_json: null,
    },
  ];

  private employeeCounters: { [tenantId: string]: number } = {
    [TENANT_A_ID]: 10004,
    [TENANT_B_ID]: 20001,
  };

  private employeeJobHistories: any[] = [
    {
      id: 'jh-1',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111111',
      change_type: 'JOINING',
      effective_date: '2023-01-15',
      new_department_id: 'd-11111111-1111-1111-1111-111111111110',
      new_designation_id: 'des-11111111-1111-1111-1111-111111111110',
      remarks: 'Appointed as Chief Executive Officer',
      created_at: '2023-01-15T00:00:00.000Z',
    },
    {
      id: 'jh-2',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111112',
      change_type: 'JOINING',
      effective_date: '2023-06-01',
      new_department_id: 'd-11111111-1111-1111-1111-111111111111',
      new_designation_id: 'des-11111111-1111-1111-1111-111111111112',
      remarks: 'Joined as Engineering Manager',
      created_at: '2023-06-01T00:00:00.000Z',
    },
    {
      id: 'jh-3',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      change_type: 'JOINING',
      effective_date: '2024-02-01',
      new_department_id: 'd-11111111-1111-1111-1111-111111111111',
      new_designation_id: 'des-11111111-1111-1111-1111-111111111111',
      remarks: 'Joined as Principal Software Engineer',
      created_at: '2024-02-01T00:00:00.000Z',
    },
    {
      id: 'jh-4',
      tenant_id: TENANT_A_ID,
      employee_id: 'e-11111111-1111-1111-1111-111111111114',
      change_type: 'JOINING',
      effective_date: '2023-03-10',
      new_department_id: 'd-11111111-1111-1111-1111-111111111112',
      new_designation_id: 'des-11111111-1111-1111-1111-111111111113',
      remarks: 'Appointed as HR Director',
      created_at: '2023-03-10T00:00:00.000Z',
    },
  ];

  // ===================== CRUD METHODS WITH TENANT FILTERING =====================

  // Auth / Users
  findUserByEmail(tenantId: string, email: string) {
    return this.users.find((u) => u.tenant_id === tenantId && u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(tenantId: string, id: string) {
    return this.users.find((u) => u.tenant_id === tenantId && u.id === id);
  }

  // Employees
  getEmployees(tenantId: string, query?: { search?: string; departmentId?: string; status?: string }) {
    return this.employees
      .filter((emp) => {
        if (emp.tenant_id !== tenantId) return false;
        if (query?.departmentId && emp.department_id !== query.departmentId) return false;
        if (query?.status && emp.employment_status !== query.status) return false;
        if (query?.search) {
          const q = query.search.toLowerCase();
          const matchesName = `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(q);
          const matchesCode = emp.employee_code.toLowerCase().includes(q);
          const matchesEmail = emp.work_email.toLowerCase().includes(q);
          if (!matchesName && !matchesCode && !matchesEmail) return false;
        }
        return true;
      })
      .map((emp) => {
        const profile = this.employeeProfiles.find((p) => p.tenant_id === tenantId && p.employee_id === emp.id);
        const dept = this.departments.find((d) => d.id === emp.department_id);
        const desig = this.designations.find((d) => d.id === emp.designation_id);
        const loc = this.locations.find((l) => l.id === emp.location_id);
        return {
          ...emp,
          nick_name: emp.nick_name || emp.first_name,
          role: emp.role || 'Team member',
          photo: emp.photo || null,
          department: dept ? dept.name : 'General',
          designation: desig ? desig.title : 'Team Member',
          location: loc ? loc.name : 'Bangalore HQ',
          pan_number: profile?.pan_number || 'ABCDE9999Z',
          aadhaar_masked: profile?.aadhaar_number_masked || 'XXXX-XXXX-9999',
          bank_account: profile?.bank_account_number || '50100999999999',
          profile: profile || null,
        };
      });
  }

  getEmployeeById(tenantId: string, id: string) {
    const emp = this.employees.find((e) => e.tenant_id === tenantId && e.id === id);
    if (!emp) return null;
    const profile = this.employeeProfiles.find((p) => p.tenant_id === tenantId && p.employee_id === id);
    const dept = this.departments.find((d) => d.id === emp.department_id);
    const desig = this.designations.find((d) => d.id === emp.designation_id);
    const loc = this.locations.find((l) => l.id === emp.location_id);
    return {
      ...emp,
      nick_name: emp.nick_name || emp.first_name,
      role: emp.role || 'Team member',
      photo: emp.photo || null,
      department: dept ? dept.name : 'General',
      designation: desig ? desig.title : 'Team Member',
      location: loc ? loc.name : 'Bangalore HQ',
      pan_number: profile?.pan_number || 'ABCDE9999Z',
      aadhaar_masked: profile?.aadhaar_number_masked || 'XXXX-XXXX-9999',
      bank_account: profile?.bank_account_number || '50100999999999',
      profile,
    };
  }

  createEmployee(tenantId: string, data: any) {
    const id = `e-${Date.now()}`;
    const nextSeq = (this.employeeCounters[tenantId] || 10000) + 1;
    this.employeeCounters[tenantId] = nextSeq;
    const generatedCode = `EMP-${nextSeq}`;

    let deptId = data.department_id;
    if (!deptId && data.department) {
      const matchDept = this.departments.find(
        (d) => d.tenant_id === tenantId && d.name.toLowerCase() === data.department.toLowerCase(),
      );
      if (matchDept) deptId = matchDept.id;
    }
    let desigId = data.designation_id;
    if (!desigId && data.designation) {
      const matchDesig = this.designations.find(
        (d) => d.tenant_id === tenantId && d.title.toLowerCase() === data.designation.toLowerCase(),
      );
      if (matchDesig) desigId = matchDesig.id;
    }

    const newEmp = {
      id,
      tenant_id: tenantId,
      employee_code: data.employee_code || data.employee_id || generatedCode,
      first_name: data.first_name,
      last_name: data.last_name || '',
      nick_name: data.nick_name || data.first_name,
      role: data.role || 'Team member',
      photo: data.photo || null,
      work_email: data.work_email || `${data.first_name.toLowerCase()}.${(data.last_name || 'emp').toLowerCase()}@cubeai.internal`,
      personal_email: data.personal_email || '',
      mobile_phone: data.mobile_phone || '+91 9840000000',
      gender: data.gender || 'Not Specified',
      date_of_birth: data.date_of_birth || '1995-01-01',
      joining_date: data.joining_date || new Date().toISOString().split('T')[0],
      department_id: deptId || this.departments.find((d) => d.tenant_id === tenantId)?.id || null,
      designation_id: desigId || this.designations.find((d) => d.tenant_id === tenantId)?.id || null,
      location_id: data.location_id || this.locations.find((l) => l.tenant_id === tenantId)?.id || null,
      reporting_manager_id: data.reporting_manager_id || null,
      employment_status: data.employment_status || 'PROBATION',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.employees.push(newEmp);

    const profile = {
      employee_id: id,
      tenant_id: tenantId,
      pan_number: data.pan_number || 'ABCDE9999Z',
      aadhaar_number_masked: data.aadhaar_masked || 'XXXX-XXXX-9999',
      uan_number: data.uan_number || '100987654399',
      bank_name: data.bank_name || 'HDFC Bank',
      bank_account_number: data.bank_account || '50100999999999',
      bank_ifsc_code: data.bank_ifsc_code || 'HDFC0001234',
      current_address: data.current_address || { city: 'Bangalore', state: 'Karnataka', pincode: '560100' },
      permanent_address: data.permanent_address || { city: 'Bangalore', state: 'Karnataka', pincode: '560100' },
      emergency_contact: data.emergency_contact || { name: 'Emergency Contact', relation: 'Family', phone: '+91 9840000000' },
    };
    this.employeeProfiles.push(profile);

    this.employeeJobHistories.push({
      id: `jh-${Date.now()}`,
      tenant_id: tenantId,
      employee_id: id,
      change_type: 'JOINING',
      effective_date: newEmp.joining_date,
      new_department_id: newEmp.department_id,
      new_designation_id: newEmp.designation_id,
      remarks: 'Initial appointment',
      created_at: new Date().toISOString(),
    });

    const dept = this.departments.find((d) => d.id === newEmp.department_id);
    const desig = this.designations.find((d) => d.id === newEmp.designation_id);
    const loc = this.locations.find((l) => l.id === newEmp.location_id);

    return {
      ...newEmp,
      department: dept?.name || 'General',
      designation: desig?.title || 'Team Member',
      location: loc?.name || 'Bangalore HQ',
      pan_number: profile.pan_number,
      aadhaar_masked: profile.aadhaar_number_masked,
      bank_account: profile.bank_account_number,
      profile,
    };
  }

  updateEmployee(tenantId: string, id: string, data: any) {
    const emp = this.employees.find((e) => e.tenant_id === tenantId && e.id === id);
    if (!emp) throw new Error('Employee not found');

    if (data.reporting_manager_id !== undefined && data.reporting_manager_id !== emp.reporting_manager_id) {
      if (data.reporting_manager_id === id) {
        throw new Error('An employee cannot report to themselves');
      }
      let curr = data.reporting_manager_id;
      while (curr) {
        const mgr = this.employees.find((e) => e.tenant_id === tenantId && e.id === curr);
        if (!mgr) break;
        if (mgr.reporting_manager_id === id) {
          throw new Error('Circular reporting hierarchy detected');
        }
        curr = mgr.reporting_manager_id;
      }
    }

    Object.assign(emp, data, { updated_at: new Date().toISOString() });
    return this.getEmployeeById(tenantId, id);
  }

  updateEmployeeStatus(tenantId: string, id: string, status: string, reason?: string) {
    const emp = this.employees.find((e) => e.tenant_id === tenantId && e.id === id);
    if (!emp) throw new Error('Employee not found');
    const oldStatus = emp.employment_status;
    emp.employment_status = status;
    emp.updated_at = new Date().toISOString();

    this.employeeJobHistories.push({
      id: `jh-${Date.now()}`,
      tenant_id: tenantId,
      employee_id: id,
      change_type: 'STATUS_CHANGE',
      effective_date: new Date().toISOString().split('T')[0],
      remarks: reason || `Status changed from ${oldStatus} to ${status}`,
      created_at: new Date().toISOString(),
    });

    return emp;
  }

  updateEmployeeProfile(tenantId: string, employeeId: string, data: any) {
    let profile = this.employeeProfiles.find((p) => p.tenant_id === tenantId && p.employee_id === employeeId);
    if (!profile) {
      profile = {
        employee_id: employeeId,
        tenant_id: tenantId,
        pan_number: data.pan_number || '',
        aadhaar_number_masked: data.aadhaar_number_masked || '',
        uan_number: data.uan_number || '',
        bank_name: data.bank_name || '',
        bank_account_number: data.bank_account_number || '',
        bank_ifsc_code: data.bank_ifsc_code || '',
        current_address: data.current_address || {},
        permanent_address: data.permanent_address || {},
        emergency_contact: data.emergency_contact || {},
      };
      this.employeeProfiles.push(profile);
    } else {
      Object.assign(profile, data);
    }
    return profile;
  }

  deactivateEmployee(tenantId: string, id: string) {
    const emp = this.employees.find((e) => e.tenant_id === tenantId && e.id === id);
    if (!emp) throw new Error('Employee not found');
    emp.employment_status = 'INACTIVE';
    emp.updated_at = new Date().toISOString();
    return { success: true, message: 'Employee deactivated successfully' };
  }

  restoreEmployee(tenantId: string, id: string) {
    const emp = this.employees.find((e) => e.tenant_id === tenantId && e.id === id);
    if (!emp) throw new Error('Employee not found');
    emp.employment_status = 'ACTIVE_CONFIRMED';
    emp.updated_at = new Date().toISOString();
    return { success: true, message: 'Employee restored successfully' };
  }

  getRecycleBin(tenantId: string) {
    return this.employees.filter((e) => e.tenant_id === tenantId && e.employment_status === 'INACTIVE');
  }

  private hrProcesses: any[] = [
    {
      id: 'proc-1',
      tenant_id: TENANT_A_ID,
      process: 'Department Change',
      status: 'Approved',
      key_field: 'EMP-10003 - John Doe',
      value: 'Engineering -> Management',
      effective_date: '15-Nov-2026',
      reason: 'Internal Promotion & Role Alignment',
      employee_id: 'e-11111111-1111-1111-1111-111111111113',
      created_at: '2026-11-10T00:00:00.000Z',
    },
    {
      id: 'proc-2',
      tenant_id: TENANT_A_ID,
      process: 'Location Change',
      status: 'Pending',
      key_field: 'EMP-10002 - Sarah Jenkins',
      value: 'Bangalore HQ -> London Central',
      effective_date: '01-Dec-2026',
      reason: 'Global Expansion Leadership Transfer',
      employee_id: 'e-11111111-1111-1111-1111-111111111112',
      created_at: '2026-11-12T00:00:00.000Z',
    },
    {
      id: 'proc-3',
      tenant_id: TENANT_A_ID,
      process: 'Designation Change',
      status: 'Approved',
      key_field: 'EMP-10004 - Priya Natarajan',
      value: 'HR Manager -> HR Director',
      effective_date: '01-Oct-2026',
      reason: 'Annual Performance Appraisal Promotion',
      employee_id: 'e-11111111-1111-1111-1111-111111111114',
      created_at: '2026-10-01T00:00:00.000Z',
    },
  ];

  getHrProcesses(tenantId: string, processFilter?: string) {
    let list = this.hrProcesses.filter((p) => p.tenant_id === tenantId);
    if (processFilter && processFilter !== 'All') {
      list = list.filter((p) => p.process.toLowerCase() === processFilter.toLowerCase());
    }
    return list;
  }

  createHrProcess(tenantId: string, data: any) {
    const id = `proc-${Date.now()}`;
    const newProcess = {
      id,
      tenant_id: tenantId,
      process: data.process || 'Department Change',
      status: data.status || 'Pending',
      key_field: data.key_field || data.employee_name || 'Employee',
      value: data.value || `${data.current_value || ''} -> ${data.new_value || ''}`,
      effective_date: data.effective_date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reason: data.reason || 'Requested change',
      employee_id: data.employee_id || null,
      created_at: new Date().toISOString(),
    };
    this.hrProcesses.unshift(newProcess);

    // Apply the change to the employee record if employee_id is provided
    if (data.employee_id) {
      const emp = this.employees.find((e) => e.tenant_id === tenantId && (e.id === data.employee_id || e.employee_code === data.employee_id));
      if (emp) {
        if (data.process === 'Department Change' && data.new_department_id) {
          emp.department_id = data.new_department_id;
        } else if (data.process === 'Designation Change' && data.new_designation_id) {
          emp.designation_id = data.new_designation_id;
        } else if (data.process === 'Location Change' && data.new_location_id) {
          emp.location_id = data.new_location_id;
        }
        emp.updated_at = new Date().toISOString();
        this.employeeJobHistories.push({
          id: `jh-${Date.now()}`,
          tenant_id: tenantId,
          employee_id: emp.id,
          change_type: data.process.toUpperCase().replace(/\s+/g, '_'),
          effective_date: newProcess.effective_date,
          remarks: data.reason,
          created_at: new Date().toISOString(),
        });
      }
    }

    return newProcess;
  }

  getInsights(tenantId: string) {
    const tenantEmps = this.employees.filter((e) => e.tenant_id === tenantId && e.employment_status !== 'INACTIVE');
    const totalHeadcount = tenantEmps.length;

    // Designations breakdown
    const desigMap = new Map<string, number>();
    tenantEmps.forEach((e) => {
      const d = this.designations.find((des) => des.id === e.designation_id)?.title || 'Team Member';
      desigMap.set(d, (desigMap.get(d) || 0) + 1);
    });
    const designationsDistribution = Array.from(desigMap.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: totalHeadcount ? Math.round((count / totalHeadcount) * 100) : 0,
    }));

    // Department breakdown
    const deptMap = new Map<string, number>();
    tenantEmps.forEach((e) => {
      const d = this.departments.find((dep) => dep.id === e.department_id)?.name || 'General';
      deptMap.set(d, (deptMap.get(d) || 0) + 1);
    });
    const departmentsDistribution = Array.from(deptMap.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: totalHeadcount ? Math.round((count / totalHeadcount) * 100) : 0,
    }));

    // Gender breakdown
    let maleCount = 0;
    let femaleCount = 0;
    tenantEmps.forEach((e) => {
      if ((e.gender || '').toLowerCase() === 'female') femaleCount++;
      else maleCount++;
    });

    // Age breakdown
    let ageUnder25 = 0;
    let age25to34 = 0;
    let age35to44 = 0;
    let age45plus = 0;
    tenantEmps.forEach((e) => {
      const birthYear = e.date_of_birth ? new Date(e.date_of_birth).getFullYear() : 1995;
      const age = 2026 - birthYear;
      if (age < 25) ageUnder25++;
      else if (age <= 34) age25to34++;
      else if (age <= 44) age35to44++;
      else age45plus++;
    });

    return {
      headcount: totalHeadcount,
      headcountGrowthYoY: 12.5,
      headcountGrowthMoM: 4.2,
      additionCount: Math.min(8, totalHeadcount),
      additionGrowthYoY: 10.0,
      additionGrowthMoM: 2.1,
      attritionCount: 0,
      attritionRate: '0.00%',
      monthlyAdditions: [
        { month: 'June', count: 0, percentage: 0 },
        { month: 'July', count: 0, percentage: 0 },
        { month: 'August', count: 0, percentage: 0 },
        { month: 'September', count: 0, percentage: 0 },
        { month: 'October', count: 1, percentage: 8.3 },
        { month: 'November', count: 8, percentage: 66.7 },
      ],
      monthlyAttritions: [
        { month: 'June', count: 0, percentage: 0 },
        { month: 'July', count: 0, percentage: 0 },
        { month: 'August', count: 0, percentage: 0 },
        { month: 'September', count: 0, percentage: 0 },
        { month: 'October', count: 0, percentage: 0 },
        { month: 'November', count: 0, percentage: 0 },
      ],
      designationsDistribution,
      departmentsDistribution,
      genderDistribution: [
        { gender: 'Male', count: maleCount, percentage: totalHeadcount ? Math.round((maleCount / totalHeadcount) * 100) : 60 },
        { gender: 'Female', count: femaleCount, percentage: totalHeadcount ? Math.round((femaleCount / totalHeadcount) * 100) : 40 },
      ],
      ageDistribution: [
        { group: '< 25', count: ageUnder25, percentage: totalHeadcount ? Math.round((ageUnder25 / totalHeadcount) * 100) : 15 },
        { group: '25-34', count: age25to34, percentage: totalHeadcount ? Math.round((age25to34 / totalHeadcount) * 100) : 55 },
        { group: '35-44', count: age35to44, percentage: totalHeadcount ? Math.round((age35to44 / totalHeadcount) * 100) : 20 },
        { group: '45+', count: age45plus, percentage: totalHeadcount ? Math.round((age45plus / totalHeadcount) * 100) : 10 },
      ],
      experienceDistribution: [
        { group: '0-1 yr', count: 3, percentage: 25 },
        { group: '1-3 yrs', count: 5, percentage: 40 },
        { group: '3-5 yrs', count: 3, percentage: 25 },
        { group: '5+ yrs', count: 2, percentage: 10 },
      ],
    };
  }

  getJobHistory(tenantId: string, employeeId: string) {
    return this.employeeJobHistories
      .filter((h) => h.tenant_id === tenantId && h.employee_id === employeeId)
      .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime());
  }

  addJobHistory(tenantId: string, employeeId: string, data: any) {
    const item = {
      id: `jh-${Date.now()}`,
      tenant_id: tenantId,
      employee_id: employeeId,
      change_type: data.change_type || 'PROMOTION',
      effective_date: data.effective_date || new Date().toISOString().split('T')[0],
      previous_department_id: data.previous_department_id || null,
      new_department_id: data.new_department_id || null,
      previous_designation_id: data.previous_designation_id || null,
      new_designation_id: data.new_designation_id || null,
      remarks: data.remarks || '',
      created_at: new Date().toISOString(),
    };
    this.employeeJobHistories.push(item);
    return item;
  }

  getOrgTree(tenantId: string) {
    const tenantEmps = this.employees.filter((e) => e.tenant_id === tenantId && e.employment_status !== 'INACTIVE');
    const map = new Map<string, any>();
    tenantEmps.forEach((e) => {
      const desig = this.designations.find((d) => d.id === e.designation_id)?.title || 'Team Member';
      const dept = this.departments.find((d) => d.id === e.department_id)?.name || 'General';
      map.set(e.id, {
        id: e.id,
        name: `${e.first_name} ${e.last_name}`,
        title: desig,
        department: dept,
        email: e.work_email,
        employeeCode: e.employee_code,
        children: [],
      });
    });

    let root: any = null;
    tenantEmps.forEach((e) => {
      const node = map.get(e.id);
      if (!e.reporting_manager_id || !map.has(e.reporting_manager_id)) {
        if (!root) root = node;
      } else {
        const parent = map.get(e.reporting_manager_id);
        parent.children.push(node);
      }
    });

    return root || (tenantEmps.length > 0 ? map.get(tenantEmps[0].id) : null);
  }

  // Departments & Designations
  getDepartments(tenantId: string) {
    const activeDepts = this.departments.filter((d) => d.tenant_id === tenantId && d.status !== 'INACTIVE');
    return activeDepts.map((d) => {
      const emps = this.employees.filter((e) => e.tenant_id === tenantId && e.department_id === d.id);
      const lead = d.lead_employee_id
        ? this.employees.find((e) => e.id === d.lead_employee_id)
        : null;
      return {
        ...d,
        member_count: emps.length,
        lead_name: d.lead_name || (lead ? `${lead.first_name} ${lead.last_name}` : null),
      };
    });
  }

  createDepartment(tenantId: string, data: any) {
    const id = `d-${Date.now()}`;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    const newDept = {
      id,
      tenant_id: tenantId,
      name: data.name,
      code: data.code || data.name.substring(0, 4).toUpperCase(),
      mail_alias: data.mail_alias || '',
      added_by: data.added_by || '1 - Dhandabani - M',
      added_time: data.added_time || nowStr,
      modified_by: data.modified_by || '1 - Dhandabani - M',
      modified_time: data.modified_time || nowStr,
      parent_department_id: data.parent_department_id || null,
      lead_employee_id: data.lead_employee_id || null,
      lead_name: data.lead_name || null,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    this.departments.push(newDept);
    return newDept;
  }

  updateDepartment(tenantId: string, id: string, data: any) {
    const dept = this.departments.find((d) => d.tenant_id === tenantId && d.id === id);
    if (!dept) throw new Error('Department not found');
    Object.assign(dept, data);
    return dept;
  }

  deleteDepartment(tenantId: string, id: string) {
    const dept = this.departments.find((d) => d.tenant_id === tenantId && d.id === id);
    if (!dept) throw new Error('Department not found');
    dept.status = 'INACTIVE';
    return { success: true, message: 'Department deactivated successfully' };
  }

  getDesignations(tenantId: string) {
    return this.designations.filter((d) => d.tenant_id === tenantId && d.status !== 'INACTIVE');
  }

  createDesignation(tenantId: string, data: any) {
    const id = `des-${Date.now()}`;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    const newDesig = {
      id,
      tenant_id: tenantId,
      title: data.title,
      code: data.code || data.title.substring(0, 4).toUpperCase(),
      mail_alias: data.mail_alias || '',
      added_by: data.added_by || '1 - Dhandabani - M',
      added_time: data.added_time || nowStr,
      modified_by: data.modified_by || '1 - Dhandabani - M',
      modified_time: data.modified_time || nowStr,
      department_id: data.department_id || null,
      grade_level: data.grade_level || 'L1',
      status: 'ACTIVE',
    };
    this.designations.push(newDesig);
    return newDesig;
  }

  updateDesignation(tenantId: string, id: string, data: any) {
    const desig = this.designations.find((d) => d.tenant_id === tenantId && d.id === id);
    if (!desig) throw new Error('Designation not found');
    Object.assign(desig, data);
    return desig;
  }

  getLocations(tenantId: string) {
    return this.locations.filter((l) => l.tenant_id === tenantId);
  }

  // Onboarding / Candidates
  getCandidates(tenantId: string, status?: string) {
    return this.candidates.filter((c) => {
      if (c.tenant_id !== tenantId) return false;
      if (status && c.status !== status) return false;
      return true;
    });
  }

  createCandidate(tenantId: string, data: any) {
    const id = `c-${Date.now()}`;
    const newCandidate = {
      id,
      tenant_id: tenantId,
      ...data,
      invitation_token: `tok-${Date.now()}`,
      status: 'INVITED',
      created_at: new Date().toISOString(),
    };
    this.candidates.push(newCandidate);
    return newCandidate;
  }

  convertCandidateToEmployee(tenantId: string, candidateId: string, payload: any) {
    const candidate = this.candidates.find((c) => c.tenant_id === tenantId && c.id === candidateId);
    if (!candidate) throw new Error('Candidate not found');

    const employeeCode = payload.employeeCode || `EMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEmp = this.createEmployee(tenantId, {
      employee_code: employeeCode,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      work_email: payload.officialEmail || `${candidate.first_name.toLowerCase()}.${candidate.last_name.toLowerCase()}@cubeai.internal`,
      personal_email: candidate.email,
      mobile_phone: candidate.mobile_phone,
      joining_date: payload.joiningDate || candidate.proposed_joining_date,
      department_id: candidate.department_id,
      designation_id: candidate.designation_id,
      employment_status: 'PROBATION',
    });

    candidate.status = 'CONVERTED_TO_EMPLOYEE';
    candidate.converted_employee_id = newEmp.id;

    return { candidate, employee: newEmp };
  }

  massUpdateCandidates(tenantId: string, candidateIds: string[], updates: Record<string, any>) {
    const updated: any[] = [];
    for (const c of this.candidates) {
      if (c.tenant_id === tenantId && candidateIds.includes(c.id)) {
        Object.assign(c, updates);
        c.updated_at = new Date().toISOString();
        updated.push(c);
      }
    }
    return { success: true, count: updated.length, candidates: updated };
  }

  bulkDeleteCandidates(tenantId: string, candidateIds: string[]) {
    const initialCount = this.candidates.length;
    this.candidates = this.candidates.filter(
      (c) => !(c.tenant_id === tenantId && candidateIds.includes(c.id))
    );
    const deletedCount = initialCount - this.candidates.length;
    return { success: true, count: deletedCount };
  }

  bulkConvertCandidates(tenantId: string, candidateIds: string[], payload?: any) {
    const converted: any[] = [];
    for (const id of candidateIds) {
      try {
        const result = this.convertCandidateToEmployee(tenantId, id, payload || {});
        converted.push(result);
      } catch {
        // Skip candidate if conversion fails
      }
    }
    return { success: true, count: converted.length, converted };
  }

  bulkInviteCandidates(tenantId: string, candidateIds: string[]) {
    let count = 0;
    for (const c of this.candidates) {
      if (c.tenant_id === tenantId && candidateIds.includes(c.id)) {
        c.status = 'INVITED';
        c.invitation_token = `tok-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        c.updated_at = new Date().toISOString();
        count++;
      }
    }
    return { success: true, count };
  }

  bulkImportCandidates(tenantId: string, candidatesList: any[]) {
    const created: any[] = [];
    for (const item of candidatesList) {
      const id = item.id || `c-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const newCand = {
        id,
        tenant_id: tenantId,
        ...item,
        invitation_token: item.invitation_token || `tok-${Date.now()}`,
        status: item.status || 'INVITED',
        created_at: item.created_at || new Date().toISOString(),
      };
      this.candidates.push(newCand);
      created.push(newCand);
    }
    return { success: true, count: created.length, candidates: created };
  }

  exportCandidates(tenantId: string) {
    return this.getCandidates(tenantId).map((c) => {
      const dept = this.departments.find((d) => d.id === c.department_id);
      const desig = this.designations.find((d) => d.id === c.designation_id);
      return {
        ...c,
        department_name: dept?.name || c.department || '',
        designation_title: desig?.title || c.designation || '',
      };
    });
  }

  getCandidatesAuditHistory(tenantId: string) {
    return this.getCandidates(tenantId).map((c) => ({
      candidate_id: c.id,
      candidate_name: `${c.first_name} ${c.last_name}`,
      email: c.email,
      status: c.status,
      timestamp: c.created_at,
      action: 'CANDIDATE_LIFECYCLE_EVENT',
      performed_by: 'HR Admin',
    }));
  }

  getAccessLogs(tenantId: string) {
    return [
      { id: `log-${Date.now()}-1`, timestamp: new Date().toISOString(), user: 'admin@cubeai.internal', role: 'SUPER_ADMIN', action: 'VIEW_CANDIDATE_PIPELINE', ip: '192.168.1.101', status: 'SUCCESS' },
      { id: `log-${Date.now()}-2`, timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'hr.admin@cubeai.internal', role: 'HR_ADMIN', action: 'VERIFY_DOCUMENTS', ip: '192.168.1.105', status: 'SUCCESS' },
      { id: `log-${Date.now()}-3`, timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'hiring.manager@cubeai.internal', role: 'HIRING_MANAGER', action: 'EXPORT_CANDIDATE_ROSTER', ip: '192.168.1.109', status: 'SUCCESS' },
    ];
  }

  // Help Desk / Cases
  getCases(tenantId: string, filter?: { status?: string; priority?: string }) {
    return this.cases.filter((c) => {
      if (c.tenant_id !== tenantId) return false;
      if (filter?.status && c.status !== filter.status) return false;
      if (filter?.priority && c.priority !== filter.priority) return false;
      return true;
    });
  }

  getCaseById(tenantId: string, id: string) {
    const c = this.cases.find((item) => item.tenant_id === tenantId && item.id === id);
    if (!c) return null;
    const messages = this.caseMessages.filter((m) => m.tenant_id === tenantId && m.case_id === id);
    const category = this.caseCategories.find((cat) => cat.id === c.category_id);
    return { ...c, messages, category };
  }

  createCase(tenantId: string, data: any) {
    const id = `case-${Date.now()}`;
    const caseNumber = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase = {
      id,
      tenant_id: tenantId,
      case_number: caseNumber,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      ...data,
    };
    this.cases.push(newCase);
    return newCase;
  }

  addCaseMessage(tenantId: string, caseId: string, data: any) {
    const msg = {
      id: `cmsg-${Date.now()}`,
      tenant_id: tenantId,
      case_id: caseId,
      created_at: new Date().toISOString(),
      ...data,
    };
    this.caseMessages.push(msg);
    return msg;
  }

  resolveCase(tenantId: string, caseId: string, resolutionSummary: string) {
    const c = this.cases.find((item) => item.tenant_id === tenantId && item.id === caseId);
    if (!c) throw new Error('Case not found');
    c.status = 'RESOLVED';
    (c as any).resolved_at = new Date().toISOString();
    (c as any).resolution_summary = resolutionSummary;
    return c;
  }

  getCaseCategories(tenantId: string) {
    return this.caseCategories.filter((c) => c.tenant_id === tenantId);
  }

  // Documents & Compliance
  getPolicies(tenantId: string) {
    return this.policies.filter((p) => p.tenant_id === tenantId);
  }

  acknowledgePolicy(tenantId: string, policyId: string, employeeId: string, ip?: string, ua?: string) {
    const ack = {
      id: `ack-${Date.now()}`,
      tenant_id: tenantId,
      policy_id: policyId,
      employee_id: employeeId,
      acknowledged_at: new Date().toISOString(),
      ip_address: ip || '127.0.0.1',
      user_agent: ua || 'Browser',
    };
    this.policyAcknowledgements.push(ack);
    return ack;
  }

  getEmployeeDocuments(tenantId: string, employeeId?: string) {
    return this.employeeDocuments.filter((d) => {
      if (d.tenant_id !== tenantId) return false;
      if (employeeId && d.employee_id !== employeeId) return false;
      return true;
    });
  }

  getExpiringDocuments(tenantId: string, daysAhead: number = 60) {
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysAhead);

    return this.employeeDocuments.filter((d) => {
      if (d.tenant_id !== tenantId || !d.expiry_date) return false;
      const exp = new Date(d.expiry_date);
      return exp >= now && exp <= threshold;
    });
  }

  // Offboarding / Exits
  getExitRequests(tenantId: string) {
    return this.exitRequests.filter((e) => e.tenant_id === tenantId);
  }

  createExitRequest(tenantId: string, data: any) {
    const id = `exit-${Date.now()}`;
    const newExit = {
      id,
      tenant_id: tenantId,
      status: 'SUBMITTED',
      notice_period_days: 30,
      created_at: new Date().toISOString(),
      ...data,
    };
    this.exitRequests.push(newExit);
    return newExit;
  }

  getClearances(tenantId: string, exitRequestId: string) {
    return this.exitClearanceItems.filter(
      (c) => c.tenant_id === tenantId && c.exit_request_id === exitRequestId,
    );
  }

  updateClearanceItem(tenantId: string, itemId: string, status: string, holdReason?: string, amount?: number) {
    const item = this.exitClearanceItems.find((c) => c.tenant_id === tenantId && c.id === itemId);
    if (!item) throw new Error('Clearance item not found');
    item.status = status;
    if (holdReason) item.hold_reason = holdReason;
    if (amount !== undefined) item.recovery_amount = amount;
    return item;
  }

  getFnfSettlement(tenantId: string, exitRequestId: string) {
    return {
      exit_request_id: exitRequestId,
      tenant_id: tenantId,
      earned_salary: 85000.0,
      leave_encashment: 28333.33,
      gratuity_amount: 0.0,
      notice_recovery: 0.0,
      asset_deductions: 0.0,
      tax_deductions: 12500.0,
      net_payable: 100833.33,
      status: 'DRAFT',
    };
  }

  // ESS
  getAnnouncements(tenantId: string) {
    return this.announcements.filter((a) => a.tenant_id === tenantId);
  }

  createProfileRequest(tenantId: string, data: any) {
    const req = {
      id: `preq-${Date.now()}`,
      tenant_id: tenantId,
      status: 'PENDING_REVIEW',
      created_at: new Date().toISOString(),
      ...data,
    };
    this.profileRequests.push(req);
    return req;
  }

  getProfileRequests(tenantId: string) {
    return this.profileRequests.filter((r) => r.tenant_id === tenantId);
  }

  createDelegation(tenantId: string, data: any) {
    const del = {
      id: `del-${Date.now()}`,
      tenant_id: tenantId,
      is_active: true,
      created_at: new Date().toISOString(),
      ...data,
    };
    this.delegations.push(del);
    return del;
  }

  // Custom Fields
  getCustomFieldDefinitions(tenantId: string) {
    return this.customFieldDefinitions.filter((f) => f.tenant_id === tenantId && f.is_active);
  }

  createCustomFieldDefinition(tenantId: string, data: any) {
    const field = {
      id: `cfd-${Date.now()}`,
      tenant_id: tenantId,
      is_active: true,
      created_at: new Date().toISOString(),
      ...data,
    };
    this.customFieldDefinitions.push(field);
    return field;
  }

  getCustomFieldValues(tenantId: string, employeeId: string) {
    const values = this.customFieldValues.filter((v) => v.tenant_id === tenantId && v.employee_id === employeeId);
    return values.map((val) => {
      const def = this.customFieldDefinitions.find((d) => d.id === val.field_id);
      return {
        ...val,
        field_definition: def,
      };
    });
  }

  setCustomFieldValue(tenantId: string, employeeId: string, fieldId: string, value: string) {
    let existing = this.customFieldValues.find(
      (v) => v.tenant_id === tenantId && v.employee_id === employeeId && v.field_id === fieldId,
    );
    if (existing) {
      existing.value_text = value;
      return existing;
    }
    const newVal = {
      id: `cfv-${Date.now()}`,
      tenant_id: tenantId,
      employee_id: employeeId,
      field_id: fieldId,
      value_text: value,
      value_json: null,
    };
    this.customFieldValues.push(newVal);
    return newVal;
  }
}
