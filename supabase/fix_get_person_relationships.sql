create or replace function public.get_person_relationships(target_person_id uuid)
returns table (
  id uuid,
  created_at timestamptz,
  gender smallint,
  initials text,
  name text,
  person_id uuid,
  relationship_code text,
  relationship_kind text,
  surname text,
  is_blood_relation boolean
)
language sql
stable
as $$
  with matched_relationships as (
    select
      relationships.id,
      relationships.relationship_kind,
      relationships.is_blood_relation,
      case
        when relationships.relationship_kind = 'parent'
          and relationships.target_person_id = $1 then 'parent'
        when relationships.relationship_kind = 'parent'
          and relationships.source_person_id = $1 then 'child'
        else relationships.relationship_kind
      end as relationship_code,
      case
        when relationships.relationship_kind = 'parent'
          and relationships.target_person_id = $1 then relationships.source_person_id
        when relationships.relationship_kind = 'parent'
          and relationships.source_person_id = $1 then relationships.target_person_id
        when relationships.source_person_id = $1 then relationships.target_person_id
        else relationships.source_person_id
      end as related_person_id
    from public.relationships
    where relationships.profile_id = auth.uid()
      and (
        relationships.source_person_id = $1
        or relationships.target_person_id = $1
      )
  )
  select
    matched_relationships.id,
    people.created_at,
    people.gender,
    people.initials,
    people.name,
    people.id as person_id,
    matched_relationships.relationship_code,
    matched_relationships.relationship_kind,
    people.surname,
    matched_relationships.is_blood_relation
  from matched_relationships
  join public.people on people.id = matched_relationships.related_person_id
  order by people.created_at desc;
$$;
