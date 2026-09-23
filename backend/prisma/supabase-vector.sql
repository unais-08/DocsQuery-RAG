-- Run this after `npx prisma db push` in the Supabase SQL Editor.
create extension if not exists vector with schema extensions;

create table if not exists public.document_chunk_embeddings (
  chunk_id text primary key,
  user_id text not null,
  document_id text not null,
  chunk_index integer not null,
  page_number integer,
  embedding extensions.vector(1536) not null,
  created_at timestamptz not null default now(),
  constraint document_chunk_embeddings_chunk_fk
    foreign key (chunk_id) references public.document_chunks(id) on delete cascade,
  constraint document_chunk_embeddings_user_fk
    foreign key (user_id) references public.users(id) on delete cascade,
  constraint document_chunk_embeddings_document_fk
    foreign key (document_id) references public.documents(id) on delete cascade
);

create index if not exists document_chunk_embeddings_embedding_idx
  on public.document_chunk_embeddings using hnsw (embedding extensions.vector_cosine_ops);

create index if not exists document_chunk_embeddings_scope_idx
  on public.document_chunk_embeddings (user_id, document_id);

create or replace function public.match_document_chunks(
  query_embedding extensions.vector(1536),
  match_user_id text,
  match_document_ids text[],
  match_count integer
)
returns table (
  chunk_id text,
  document_id text,
  chunk_index integer,
  page_number integer,
  similarity double precision
)
language sql
stable
as $$
  select
    embeddings.chunk_id,
    embeddings.document_id,
    embeddings.chunk_index,
    embeddings.page_number,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  from public.document_chunk_embeddings as embeddings
  where embeddings.user_id = match_user_id
    and embeddings.document_id = any(match_document_ids)
  order by embeddings.embedding <=> query_embedding
  limit match_count;
$$;