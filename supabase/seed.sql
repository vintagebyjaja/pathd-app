-- Find where Supabase installed each extension (it may be "extensions", "postgis",
-- or another schema), install any that are missing, and put them all on the search path.
do $$
declare
  ext text;
  sch text;
  schemas text := 'public, extensions';
begin
  create schema if not exists extensions;
  foreach ext in array array['citext', 'pg_trgm', 'postgis'] loop
    select n.nspname into sch from pg_extension e join pg_namespace n on n.oid = e.extnamespace where e.extname = ext;
    if sch is null then
      execute format('create extension %I with schema extensions', ext);
      sch := 'extensions';
    end if;
    if position(quote_ident(sch) in schemas) = 0 then
      schemas := schemas || ', ' || quote_ident(sch);
    end if;
  end loop;
  perform set_config('search_path', schemas, false);
end $$;

-- DEMO DATA ONLY. Fictional companies and jobs, all flagged is_demo = true.
-- Generated from src/lib/data/demo/jobs.ts. Do not load into production.

insert into companies (slug, name, industry, is_demo) values ('tidewell-health', 'Tidewell Health', 'Healthcare', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('tidewell-health-university', 'Tidewell Health University', 'Healthcare', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('cabarrus-valley-medical', 'Cabarrus Valley Medical', 'Healthcare', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('brightwater-family-medicine', 'Brightwater Family Medicine', 'Healthcare', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('motion-lab-rehab', 'Motion Lab Rehab', 'Healthcare', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('northlake-pediatrics', 'Northlake Pediatrics', 'Healthcare', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('quarry-labs', 'Quarry Labs', 'Technology', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('lumen-grid-energy', 'Lumen Grid Energy', 'Technology', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('ironbark-security', 'Ironbark Security', 'Technology', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('meridian-span-engineering', 'Meridian Span Engineering', 'Technology', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('northstar-consumer-group', 'Northstar Consumer Group', 'Business Strategy', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('fieldnote-software', 'Fieldnote Software', 'Business Strategy', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('harrow-and-pine-cpas', 'Harrow & Pine CPAs', 'Accounting', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('brightledger-financial', 'Brightledger Financial', 'Finance', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('carolina-crest-bank', 'Carolina Crest Bank', 'Finance', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('hollowell-logistics', 'Hollowell Logistics', 'Business', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('pinecrest-manufacturing', 'Pinecrest Manufacturing', 'Human Resources', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('talentfield-partners', 'Talentfield Partners', 'Recruiting', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('kindred-path-staffing', 'Kindred Path Staffing', 'Recruiting', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('saltbox-hotels', 'Saltbox Hotels', 'Hospitality', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('riverbend-conference-center', 'Riverbend Conference Center', 'Hospitality', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('hollis-build-group', 'Hollis Build Group', 'Construction', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('ferncourt-studio', 'Ferncourt Studio', 'Design', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('lantern-and-vale', 'Lantern & Vale', 'Design', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('halden-and-rye', 'Halden & Rye', 'Fashion', true) on conflict (slug) do nothing;
insert into companies (slug, name, industry, is_demo) values ('stitchline-studio', 'Stitchline Studio', 'Fashion', true) on conflict (slug) do nothing;

insert into skills (name) values ('Patient Care'), ('EHR'), ('Critical Care'), ('Emergency Care'), ('Team Leadership'), ('Triage'), ('Primary Care'), ('Orthopedics'), ('Treatment Planning'), ('Vitals'), ('Scheduling'), ('TypeScript'), ('React'), ('SQL'), ('AWS'), ('Excel'), ('Tableau'), ('Python'), ('SIEM'), ('Incident Response'), ('AutoCAD'), ('Civil 3D'), ('Strategy'), ('Financial Modeling'), ('Executive Communication'), ('Product Strategy'), ('Roadmapping'), ('User Research'), ('GAAP'), ('Reconciliations'), ('Tax Preparation'), ('Tax Research'), ('Credit Analysis'), ('Operations'), ('Lean'), ('Prospecting'), ('CRM'), ('Employee Relations'), ('Benefits'), ('HRIS'), ('Talent Planning'), ('Sourcing'), ('Interviewing'), ('ATS'), ('Healthcare Staffing'), ('Guest Services'), ('Event Sales'), ('Negotiation'), ('Procore'), ('Submittals'), ('Site Safety'), ('Subcontractor Management'), ('Revit'), ('Construction Documents'), ('Design Development'), ('Rhino'), ('Enscape'), ('Space Planning'), ('Finish Selection'), ('Figma'), ('Interaction Design'), ('Merchandise Planning'), ('Vendor Relations'), ('Visual Merchandising'), ('Tech Packs'), ('Fit') on conflict (name) do nothing;

with c as (select id from companies where slug = 'tidewell-health'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Registered Nurse, Med-Surg', 'Care for patients on a 32-bed medical-surgical unit. Three 12-hour shifts a week.', 'Healthcare', 'onsite', null, 'mid', 1, 'associate',
    'employer_listed', 38, 52, 'hour', null, 'pathd', 'demo', 'demo_001', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.825, 35.2045), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_001' and s.name = 'Patient Care' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_001' and s.name = 'EHR' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'license', 'RN license', true from jobs where source = 'demo' and source_job_id = 'demo_001';
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'BLS', false from jobs where source = 'demo' and source_job_id = 'demo_001';

with c as (select id from companies where slug = 'tidewell-health-university'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'ICU Registered Nurse', 'Join a 24-bed ICU with a strong preceptor program.', 'Healthcare', 'onsite', null, 'mid', 2, 'bachelor',
    'employer_listed', 42, 58, 'hour', null, 'pathd', 'demo', 'demo_002', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.742, 35.3035), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_002' and s.name = 'Critical Care' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_002' and s.name = 'Patient Care' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_002' and s.name = 'EHR' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'license', 'RN license', true from jobs where source = 'demo' and source_job_id = 'demo_002';
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'ACLS', false from jobs where source = 'demo' and source_job_id = 'demo_002';
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'BLS', false from jobs where source = 'demo' and source_job_id = 'demo_002';

with c as (select id from companies where slug = 'cabarrus-valley-medical'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Charge Nurse, Emergency Dept.', 'Lead shift operations in a Level II emergency department.', 'Healthcare', 'onsite', null, 'senior', 4, 'bachelor',
    'employer_listed', 46, 60, 'hour', null, 'pathd', 'demo', 'demo_003', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Concord', 'NC', st_setsrid(st_makepoint(-80.583, 35.412), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_003' and s.name = 'Emergency Care' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_003' and s.name = 'Team Leadership' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_003' and s.name = 'Triage' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'license', 'RN license', true from jobs where source = 'demo' and source_job_id = 'demo_003';
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'CEN', false from jobs where source = 'demo' and source_job_id = 'demo_003';
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'ACLS', false from jobs where source = 'demo' and source_job_id = 'demo_003';

with c as (select id from companies where slug = 'brightwater-family-medicine'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Nurse Practitioner, Primary Care', 'Provide primary care to adult and family patients in a growing practice.', 'Healthcare', 'onsite', null, 'senior', 2, 'master',
    'employer_listed', 118000, 135000, 'year', null, 'pathd', 'demo', 'demo_004', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.848, 35.054), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_004' and s.name = 'Primary Care' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_004' and s.name = 'Patient Care' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'license', 'NP license', true from jobs where source = 'demo' and source_job_id = 'demo_004';

with c as (select id from companies where slug = 'motion-lab-rehab'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Physical Therapist', 'Outpatient orthopedic and sports rehab.', 'Healthcare', 'onsite', null, 'mid', 1, 'doctorate',
    'employer_listed', 85000, 98000, 'year', null, 'pathd', 'demo', 'demo_005', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.823, 35.156), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_005' and s.name = 'Orthopedics' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_005' and s.name = 'Treatment Planning' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'license', 'PT license', true from jobs where source = 'demo' and source_job_id = 'demo_005';

with c as (select id from companies where slug = 'northlake-pediatrics'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Medical Assistant', 'Support a busy pediatric office with intake and scheduling.', 'Healthcare', 'onsite', null, 'entry', 0, 'high_school',
    'employer_listed', 19, 23, 'hour', null, 'pathd', 'demo', 'demo_006', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Huntersville', 'NC', st_setsrid(st_makepoint(-80.848, 35.395), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_006' and s.name = 'Vitals' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_006' and s.name = 'Scheduling' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'CMA', false from jobs where source = 'demo' and source_job_id = 'demo_006';

with c as (select id from companies where slug = 'quarry-labs'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Software Engineer II', 'Build product features for a B2B analytics platform.', 'Technology', 'hybrid', null, 'mid', 3, 'bachelor',
    'employer_listed', 105000, 130000, 'year', null, 'pathd', 'demo', 'demo_007', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.859, 35.212), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_007' and s.name = 'TypeScript' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_007' and s.name = 'React' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_007' and s.name = 'SQL' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'preferred' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_007' and s.name = 'AWS' on conflict do nothing;

with c as (select id from companies where slug = 'lumen-grid-energy'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Data Analyst', 'Turn grid and customer data into reporting for operations leaders.', 'Technology', 'hybrid', null, 'mid', 2, 'bachelor',
    'employer_listed', 78000, 92000, 'year', null, 'pathd', 'demo', 'demo_008', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.846, 35.229), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_008' and s.name = 'SQL' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_008' and s.name = 'Excel' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_008' and s.name = 'Tableau' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'preferred' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_008' and s.name = 'Python' on conflict do nothing;

with c as (select id from companies where slug = 'ironbark-security'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Cybersecurity Analyst', 'Monitor, investigate and respond to security events for client networks.', 'Technology', 'hybrid', null, 'mid', 3, 'bachelor',
    'employer_listed', 95000, 115000, 'year', null, 'pathd', 'demo', 'demo_009', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.856, 35.06), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_009' and s.name = 'SIEM' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_009' and s.name = 'Incident Response' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'Security+', false from jobs where source = 'demo' and source_job_id = 'demo_009';

with c as (select id from companies where slug = 'meridian-span-engineering'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Civil Engineer EIT', 'Design site and roadway improvements under PE supervision.', 'Technology', 'hybrid', null, 'entry', 0, 'bachelor',
    'employer_listed', 72000, 84000, 'year', null, 'pathd', 'demo', 'demo_010', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Matthews', 'NC', st_setsrid(st_makepoint(-80.724, 35.118), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_010' and s.name = 'AutoCAD' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_010' and s.name = 'Civil 3D' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'EIT', false from jobs where source = 'demo' and source_job_id = 'demo_010';

with c as (select id from companies where slug = 'northstar-consumer-group'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Strategy Manager (MBA preferred)', 'Shape growth strategy for a portfolio of consumer brands.', 'Business Strategy', 'hybrid', null, 'senior', 5, 'master',
    'employer_listed', 125000, 150000, 'year', null, 'pathd', 'demo', 'demo_011', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.827, 35.151), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_011' and s.name = 'Strategy' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_011' and s.name = 'Financial Modeling' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_011' and s.name = 'Executive Communication' on conflict do nothing;

with c as (select id from companies where slug = 'fieldnote-software'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Senior Product Manager', 'Own the roadmap for a workflow product used by small businesses.', 'Business Strategy', 'remote', 'usa', 'senior', 5, 'bachelor',
    'employer_listed', 135000, 160000, 'year', null, 'pathd', 'demo', 'demo_012', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Remote', 'USA', null from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_012' and s.name = 'Product Strategy' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_012' and s.name = 'Roadmapping' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_012' and s.name = 'User Research' on conflict do nothing;

with c as (select id from companies where slug = 'harrow-and-pine-cpas'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Staff Accountant', 'Month-end close and reconciliations for small and mid-size clients.', 'Accounting', 'hybrid', null, 'entry', 1, 'bachelor',
    'employer_listed', 62000, 72000, 'year', null, 'pathd', 'demo', 'demo_013', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.835, 35.147), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_013' and s.name = 'GAAP' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_013' and s.name = 'Reconciliations' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_013' and s.name = 'Excel' on conflict do nothing;

with c as (select id from companies where slug = 'harrow-and-pine-cpas'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Senior Tax Accountant, CPA', 'Prepare and review business and individual returns.', 'Accounting', 'hybrid', null, 'senior', 4, 'bachelor',
    'employer_listed', 88000, 105000, 'year', null, 'pathd', 'demo', 'demo_014', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.84, 35.225), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_014' and s.name = 'Tax Preparation' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_014' and s.name = 'Tax Research' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'license', 'CPA license', true from jobs where source = 'demo' and source_job_id = 'demo_014';

with c as (select id from companies where slug = 'brightledger-financial'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Financial Analyst', 'Forecasting and variance reporting for regional operations.', 'Finance', 'hybrid', null, 'mid', 2, 'bachelor',
    'employer_listed', 72000, 85000, 'year', null, 'pathd', 'demo', 'demo_015', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.842, 35.228), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_015' and s.name = 'Excel' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_015' and s.name = 'Financial Modeling' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'preferred' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_015' and s.name = 'SQL' on conflict do nothing;

with c as (select id from companies where slug = 'carolina-crest-bank'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Credit Risk Analyst', 'Assess commercial credit risk and build portfolio monitoring reports.', 'Finance', 'hybrid', null, 'mid', 3, 'bachelor',
    'employer_listed', 90000, 110000, 'year', null, 'pathd', 'demo', 'demo_016', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.841, 35.05), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_016' and s.name = 'Credit Analysis' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_016' and s.name = 'SQL' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_016' and s.name = 'Excel' on conflict do nothing;

with c as (select id from companies where slug = 'hollowell-logistics'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Operations Manager', 'Run day-to-day operations for a regional distribution center.', 'Business', 'onsite', null, 'senior', 4, 'bachelor',
    'employer_listed', 80000, 95000, 'year', null, 'pathd', 'demo', 'demo_017', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.943, 35.214), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_017' and s.name = 'Operations' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_017' and s.name = 'Team Leadership' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_017' and s.name = 'Lean' on conflict do nothing;

with c as (select id from companies where slug = 'quarry-labs'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Business Development Rep', 'Open conversations with mid-market companies. Base pay shown; commission is extra.', 'Business', 'hybrid', null, 'entry', 0, 'bachelor',
    'employer_listed', 55000, 65000, 'year', null, 'pathd', 'demo', 'demo_018', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.806, 35.247), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_018' and s.name = 'Prospecting' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_018' and s.name = 'CRM' on conflict do nothing;

with c as (select id from companies where slug = 'pinecrest-manufacturing'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'HR Generalist', 'Partner with plant leaders on hiring, onboarding and employee relations.', 'Human Resources', 'onsite', null, 'mid', 2, 'bachelor',
    'employer_listed', 62000, 72000, 'year', null, 'pathd', 'demo', 'demo_019', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Mint Hill', 'NC', st_setsrid(st_makepoint(-80.648, 35.18), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_019' and s.name = 'Employee Relations' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_019' and s.name = 'Benefits' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_019' and s.name = 'HRIS' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'SHRM-CP', false from jobs where source = 'demo' and source_job_id = 'demo_019';

with c as (select id from companies where slug = 'brightledger-financial'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'HR Business Partner', 'Advise business leaders on talent, performance and organization design.', 'Human Resources', 'hybrid', null, 'senior', 5, 'bachelor',
    'employer_listed', 95000, 112000, 'year', null, 'pathd', 'demo', 'demo_020', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.808, 35.221), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_020' and s.name = 'Employee Relations' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_020' and s.name = 'Talent Planning' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'SHRM-SCP', false from jobs where source = 'demo' and source_job_id = 'demo_020';

with c as (select id from companies where slug = 'talentfield-partners'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Technical Recruiter', 'Recruit engineers and data talent for growing tech clients.', 'Recruiting', 'hybrid', null, 'mid', 2, 'bachelor',
    'employer_listed', 70000, 85000, 'year', null, 'pathd', 'demo', 'demo_021', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.863, 35.208), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_021' and s.name = 'Sourcing' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_021' and s.name = 'Interviewing' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_021' and s.name = 'ATS' on conflict do nothing;

with c as (select id from companies where slug = 'kindred-path-staffing'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Healthcare Recruiter', 'Place nurses and allied health professionals with partner hospitals.', 'Recruiting', 'remote', 'usa', 'mid', 2, 'bachelor',
    'not_provided', null, null, 'year', null, 'external', 'demo', 'demo_022', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Remote', 'USA', null from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_022' and s.name = 'Sourcing' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_022' and s.name = 'Healthcare Staffing' on conflict do nothing;

with c as (select id from companies where slug = 'saltbox-hotels'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Hotel Front Office Manager', 'Lead the front desk team at a 180-room uptown hotel.', 'Hospitality', 'onsite', null, 'mid', 3, 'associate',
    'employer_listed', 58000, 66000, 'year', null, 'pathd', 'demo', 'demo_023', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.849, 35.2255), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_023' and s.name = 'Guest Services' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_023' and s.name = 'Team Leadership' on conflict do nothing;

with c as (select id from companies where slug = 'riverbend-conference-center'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Event Sales Manager', 'Book corporate and social events for a 40,000 sq ft venue.', 'Hospitality', 'onsite', null, 'mid', 3, 'bachelor',
    'pathd_estimate', 60000, 72000, 'year', 'Sample estimate from regional pay data for similar roles', 'pathd', 'demo', 'demo_024', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Fort Mill', 'SC', st_setsrid(st_makepoint(-80.945, 35.007), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_024' and s.name = 'Event Sales' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_024' and s.name = 'Negotiation' on conflict do nothing;

with c as (select id from companies where slug = 'hollis-build-group'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Assistant Project Manager', 'Support ground-up commercial projects from preconstruction to closeout.', 'Construction', 'onsite', null, 'mid', 2, 'bachelor',
    'employer_listed', 70000, 84000, 'year', null, 'pathd', 'demo', 'demo_025', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.73, 35.305), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_025' and s.name = 'Procore' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_025' and s.name = 'Scheduling' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_025' and s.name = 'Submittals' on conflict do nothing;

with c as (select id from companies where slug = 'hollis-build-group'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Construction Superintendent', 'Run the jobsite for a new medical office building.', 'Construction', 'onsite', null, 'senior', 7, 'high_school',
    'employer_listed', 95000, 115000, 'year', null, 'pathd', 'demo', 'demo_026', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Gastonia', 'NC', st_setsrid(st_makepoint(-81.187, 35.262), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_026' and s.name = 'Site Safety' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_026' and s.name = 'Scheduling' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_026' and s.name = 'Subcontractor Management' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'OSHA 30', false from jobs where source = 'demo' and source_job_id = 'demo_026';

with c as (select id from companies where slug = 'ferncourt-studio'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Project Designer', 'Lead design development and documents for higher-education projects.', 'Design', 'hybrid', null, 'mid', 5, 'bachelor',
    'employer_listed', 78000, 92000, 'year', null, 'pathd', 'demo', 'demo_027', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.851, 35.205), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_027' and s.name = 'Revit' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_027' and s.name = 'Construction Documents' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_027' and s.name = 'Design Development' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'preferred' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_027' and s.name = 'Rhino' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'preferred' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_027' and s.name = 'Enscape' on conflict do nothing;
insert into job_requirements (job_id, kind, name, required) select id, 'certification', 'LEED AP', false from jobs where source = 'demo' and source_job_id = 'demo_027';

with c as (select id from companies where slug = 'lantern-and-vale'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Interior Designer', 'Workplace and hospitality interiors from concept through installation.', 'Design', 'hybrid', null, 'mid', 3, 'bachelor',
    'employer_listed', 60000, 74000, 'year', null, 'pathd', 'demo', 'demo_028', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.804, 35.223), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_028' and s.name = 'Space Planning' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_028' and s.name = 'AutoCAD' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_028' and s.name = 'Finish Selection' on conflict do nothing;

with c as (select id from companies where slug = 'quarry-labs'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Senior Product Designer', 'Design end-to-end flows for a B2B analytics product.', 'Design', 'remote', 'usa', 'senior', 5, 'bachelor',
    'employer_listed', 120000, 145000, 'year', null, 'pathd', 'demo', 'demo_029', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Remote', 'USA', null from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_029' and s.name = 'Figma' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_029' and s.name = 'Interaction Design' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_029' and s.name = 'User Research' on conflict do nothing;

with c as (select id from companies where slug = 'halden-and-rye'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Assistant Buyer', 'Support buying for women''s ready-to-wear across 12 stores.', 'Fashion', 'onsite', null, 'entry', 1, 'bachelor',
    'employer_listed', 58000, 68000, 'year', null, 'pathd', 'demo', 'demo_030', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Charlotte', 'NC', st_setsrid(st_makepoint(-80.833, 35.153), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_030' and s.name = 'Merchandise Planning' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_030' and s.name = 'Excel' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_030' and s.name = 'Vendor Relations' on conflict do nothing;

with c as (select id from companies where slug = 'halden-and-rye'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Visual Merchandising Manager', 'Own windows, floor sets and brand presentation for a flagship store.', 'Fashion', 'onsite', null, 'mid', 3, 'associate',
    'employer_listed', 55000, 65000, 'year', null, 'pathd', 'demo', 'demo_031', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Huntersville', 'NC', st_setsrid(st_makepoint(-80.856, 35.362), 4326)::geography from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_031' and s.name = 'Visual Merchandising' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_031' and s.name = 'Team Leadership' on conflict do nothing;

with c as (select id from companies where slug = 'stitchline-studio'),
j as (
  insert into jobs (company_id, title, description, industry, work_type, remote_scope, experience_level, min_years_experience, education_level,
    salary_source, salary_min, salary_max, salary_period, salary_estimate_basis, apply_method, source, source_job_id, is_demo, posted_at)
  select c.id, 'Product Developer, Apparel', 'Take apparel from sketch to production with overseas partners.', 'Fashion', 'remote', 'usa', 'mid', 3, 'bachelor',
    'employer_listed', 70000, 85000, 'year', null, 'pathd', 'demo', 'demo_032', true, now()
  from c returning id
)
insert into job_locations (job_id, city, region, point)
select j.id, 'Remote', 'USA', null from j;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_032' and s.name = 'Tech Packs' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_032' and s.name = 'Fit' on conflict do nothing;
insert into job_skills (job_id, skill_id, kind) select jb.id, s.id, 'required' from jobs jb, skills s where jb.source = 'demo' and jb.source_job_id = 'demo_032' and s.name = 'Vendor Relations' on conflict do nothing;

