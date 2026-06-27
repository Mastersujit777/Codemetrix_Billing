--
-- PostgreSQL database dump
--

\restrict GlXa1yncTKSRY7S23DcpeBU8uAD4NsfqyxsGkzNIStLKhlKRiBefmHEFuq24mH0

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_group_id_97559544_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.billing_sequence_key_c05f1174_like;
DROP INDEX IF EXISTS public.billing_projectdoc_doc_id_1226cadc_like;
DROP INDEX IF EXISTS public.billing_projectdoc_doc_id_1226cadc;
DROP INDEX IF EXISTS public.billing_document_doc_id_bb5264af_like;
DROP INDEX IF EXISTS public.billing_document_doc_id_bb5264af;
DROP INDEX IF EXISTS public.auth_user_username_6821ab7c_like;
DROP INDEX IF EXISTS public.auth_user_user_permissions_user_id_a95ead1b;
DROP INDEX IF EXISTS public.auth_user_user_permissions_permission_id_1fbb5f2c;
DROP INDEX IF EXISTS public.auth_user_groups_user_id_6a12ed8b;
DROP INDEX IF EXISTS public.auth_user_groups_group_id_97559544;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.billing_service DROP CONSTRAINT IF EXISTS billing_service_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_sequence DROP CONSTRAINT IF EXISTS billing_sequence_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_sequence DROP CONSTRAINT IF EXISTS billing_sequence_key_key;
ALTER TABLE IF EXISTS ONLY public.billing_projectdoc DROP CONSTRAINT IF EXISTS billing_projectdoc_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_document DROP CONSTRAINT IF EXISTS billing_document_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_customer DROP CONSTRAINT IF EXISTS billing_customer_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_centre DROP CONSTRAINT IF EXISTS billing_centre_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_business DROP CONSTRAINT IF EXISTS billing_business_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_username_key;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_permission_id_14a6b632_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_group_id_94350c0c_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.billing_service;
DROP TABLE IF EXISTS public.billing_sequence;
DROP TABLE IF EXISTS public.billing_projectdoc;
DROP TABLE IF EXISTS public.billing_document;
DROP TABLE IF EXISTS public.billing_customer;
DROP TABLE IF EXISTS public.billing_centre;
DROP TABLE IF EXISTS public.billing_business;
DROP TABLE IF EXISTS public.auth_user_user_permissions;
DROP TABLE IF EXISTS public.auth_user_groups;
DROP TABLE IF EXISTS public.auth_user;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: billing_business; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_business (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    tag text NOT NULL,
    address text NOT NULL,
    gstin character varying(32) NOT NULL,
    pan character varying(32) NOT NULL,
    udyam character varying(64) NOT NULL,
    "stateName" character varying(64) NOT NULL,
    "stateCode" character varying(8) NOT NULL,
    contact text NOT NULL,
    "upiId" character varying(128) NOT NULL,
    "upiQr" text NOT NULL,
    "bankName" character varying(128) NOT NULL,
    "bankAccName" character varying(128) NOT NULL,
    "bankAccNo" character varying(64) NOT NULL,
    "bankIfsc" character varying(32) NOT NULL,
    extra jsonb NOT NULL
);


--
-- Name: billing_business_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.billing_business ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.billing_business_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: billing_centre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_centre (
    id bigint NOT NULL,
    "position" integer NOT NULL,
    code character varying(16) NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    extra jsonb NOT NULL
);


--
-- Name: billing_centre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.billing_centre ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.billing_centre_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: billing_customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_customer (
    id bigint NOT NULL,
    "position" integer NOT NULL,
    cid character varying(64) NOT NULL,
    name character varying(255) NOT NULL,
    kind character varying(32) NOT NULL,
    username character varying(128) NOT NULL,
    address text NOT NULL,
    "stateName" character varying(64) NOT NULL,
    "stateCode" character varying(8) NOT NULL,
    gstin character varying(32) NOT NULL,
    phone character varying(32) NOT NULL,
    email character varying(255) NOT NULL,
    "contactPersonName" character varying(255) NOT NULL,
    "contactPersonPhone" character varying(32) NOT NULL,
    notes text NOT NULL,
    extra jsonb NOT NULL
);


--
-- Name: billing_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.billing_customer ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.billing_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: billing_document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_document (
    id bigint NOT NULL,
    "position" integer NOT NULL,
    doc_id character varying(64) NOT NULL,
    number character varying(128) NOT NULL,
    kind character varying(16) NOT NULL,
    date_iso character varying(64) NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: billing_document_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.billing_document ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.billing_document_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: billing_projectdoc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_projectdoc (
    id bigint NOT NULL,
    "position" integer NOT NULL,
    doc_id character varying(64) NOT NULL,
    number character varying(128) NOT NULL,
    kind character varying(16) NOT NULL,
    date_iso character varying(64) NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: billing_projectdoc_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.billing_projectdoc ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.billing_projectdoc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: billing_sequence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_sequence (
    id bigint NOT NULL,
    key character varying(128) NOT NULL,
    value integer NOT NULL
);


--
-- Name: billing_sequence_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.billing_sequence ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.billing_sequence_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: billing_service; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_service (
    id bigint NOT NULL,
    "position" integer NOT NULL,
    sid character varying(64) NOT NULL,
    name character varying(255) NOT NULL,
    prefix character varying(16) NOT NULL,
    sac character varying(32) NOT NULL,
    rate double precision NOT NULL,
    inclusive boolean NOT NULL,
    extra jsonb NOT NULL
);


--
-- Name: billing_service_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.billing_service ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.billing_service_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add permission	1	add_permission
2	Can change permission	1	change_permission
3	Can delete permission	1	delete_permission
4	Can view permission	1	view_permission
5	Can add group	2	add_group
6	Can change group	2	change_group
7	Can delete group	2	delete_group
8	Can view group	2	view_group
9	Can add user	3	add_user
10	Can change user	3	change_user
11	Can delete user	3	delete_user
12	Can view user	3	view_user
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add business	6	add_business
22	Can change business	6	change_business
23	Can delete business	6	delete_business
24	Can view business	6	view_business
25	Can add centre	7	add_centre
26	Can change centre	7	change_centre
27	Can delete centre	7	delete_centre
28	Can view centre	7	view_centre
29	Can add customer	8	add_customer
30	Can change customer	8	change_customer
31	Can delete customer	8	delete_customer
32	Can view customer	8	view_customer
33	Can add document	9	add_document
34	Can change document	9	change_document
35	Can delete document	9	delete_document
36	Can view document	9	view_document
37	Can add project doc	10	add_projectdoc
38	Can change project doc	10	change_projectdoc
39	Can delete project doc	10	delete_projectdoc
40	Can view project doc	10	view_projectdoc
41	Can add sequence	11	add_sequence
42	Can change sequence	11	change_sequence
43	Can delete sequence	11	delete_sequence
44	Can view sequence	11	view_sequence
45	Can add service	12	add_service
46	Can change service	12	change_service
47	Can delete service	12	delete_service
48	Can view service	12	view_service
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
1	pbkdf2_sha256$870000$bejzdAT0CN6jPkYw5JJxZB$5/0sgZDAENPvsuCheYKAwkzYiw8a5qzlm6bbD8N8jfw=	2026-06-27 15:54:52.127493+05:30	f	admin				f	t	2026-06-27 15:54:04.845786+05:30
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: billing_business; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_business (id, name, tag, address, gstin, pan, udyam, "stateName", "stateCode", contact, "upiId", "upiQr", "bankName", "bankAccName", "bankAccNo", "bankIfsc", extra) FROM stdin;
7	CodeMetrix	Proprietorship · IT Training, Internships & Software Development	Kesura, Bhubaneswar, Khordha, Odisha – 752057				Odisha	21		codemetrix1@ucobank		UCO Bank	Codemetrix	25430210003343	UCBA0002543	{}
\.


--
-- Data for Name: billing_centre; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_centre (id, "position", code, name, address, extra) FROM stdin;
16	0	BAL	Balipatna	Balipatna, Khordha, Odisha	{}
17	1	KES	Kesura–Bhubaneswar	Kesura, Bhubaneswar, Odisha	{}
18	2	PAT	Patia-Bhubaneswar	Patia, Nandan Vihar, Bhubaneswar	{}
\.


--
-- Data for Name: billing_customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_customer (id, "position", cid, name, kind, username, address, "stateName", "stateCode", gstin, phone, email, "contactPersonName", "contactPersonPhone", notes, extra) FROM stdin;
6	0	cus_mn2hsj	M/S DIVIKSHA SALES MART	client	ms_diviksha	PLOT NO-928/1573, AT- Kheras, PO- Brahmansailo, Cuttack-754018	Odisha	21	21NFHPS3224D1ZL	9937896866	divikshasales.mart@gmail.com	Sumit Mohapatra	9937835200		{}
\.


--
-- Data for Name: billing_document; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_document (id, "position", doc_id, number, kind, date_iso, data) FROM stdin;
1	0	doc_5n4mu9	CM/PAT/INV/DIG/26-27/1	INV	2026-06-26	{"id": "doc_5n4mu9", "no": "CM/PAT/INV/DIG/26-27/1", "fee": 3500, "net": 3500, "cgst": 266.95, "igst": 0, "rate": 18, "sgst": 266.95, "type": "INV", "inter": false, "total": 3500, "payRef": "", "dateISO": "2026-06-26", "payMode": "Cash", "service": {"sac": "998361", "name": "Digital Advertising Services", "prefix": "DIG"}, "taxable": 2966.1, "advTotal": 0, "advances": [{"no": "", "amt": ""}], "customer": {"name": "M/S DIVIKSHA SALES MART", "gstin": "21NFHPS3224D1ZL", "phone": "9937896866", "address": "PLOT NO-928/1573, AT- Kheras, PO- Brahmansailo, Cuttack-754018", "username": "ms_diviksha", "stateCode": "21", "stateName": "Odisha"}, "lastPaid": 0, "signMode": "sign", "inclusive": true, "centreCode": "PAT"}
\.


--
-- Data for Name: billing_projectdoc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_projectdoc (id, "position", doc_id, number, kind, date_iso, data) FROM stdin;
\.


--
-- Data for Name: billing_sequence; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_sequence (id, key, value) FROM stdin;
2	PAT:INV:26-27	1
\.


--
-- Data for Name: billing_service; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_service (id, "position", sid, name, prefix, sac, rate, inclusive, extra) FROM stdin;
21	0	svc_int	Internship Programme	INT	999293	18	t	{}
22	1	svc_trn	Training Programme	TRN	999293	18	t	{}
23	2	svc_sw	Software Development	SWD	998314	18	f	{}
24	3	ser_lod5y1	Digital Advertising Services	DIG	998361	18	t	{}
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	auth	permission
2	auth	group
3	auth	user
4	contenttypes	contenttype
5	sessions	session
6	billing	business
7	billing	centre
8	billing	customer
9	billing	document
10	billing	projectdoc
11	billing	sequence
12	billing	service
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2026-06-27 15:50:51.815939+05:30
2	contenttypes	0002_remove_content_type_name	2026-06-27 15:50:51.826185+05:30
3	auth	0001_initial	2026-06-27 15:50:51.892904+05:30
4	auth	0002_alter_permission_name_max_length	2026-06-27 15:50:51.892904+05:30
5	auth	0003_alter_user_email_max_length	2026-06-27 15:50:51.901768+05:30
6	auth	0004_alter_user_username_opts	2026-06-27 15:50:51.901768+05:30
7	auth	0005_alter_user_last_login_null	2026-06-27 15:50:51.91439+05:30
8	auth	0006_require_contenttypes_0002	2026-06-27 15:50:51.91439+05:30
9	auth	0007_alter_validators_add_error_messages	2026-06-27 15:50:51.918013+05:30
10	auth	0008_alter_user_username_max_length	2026-06-27 15:50:51.926382+05:30
11	auth	0009_alter_user_last_name_max_length	2026-06-27 15:50:51.934711+05:30
12	auth	0010_alter_group_name_max_length	2026-06-27 15:50:51.947256+05:30
13	auth	0011_update_proxy_permissions	2026-06-27 15:50:51.96085+05:30
14	auth	0012_alter_user_first_name_max_length	2026-06-27 15:50:51.968836+05:30
15	billing	0001_initial	2026-06-27 15:50:52.032571+05:30
16	sessions	0001_initial	2026-06-27 15:50:52.042594+05:30
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
z16425va7gkt0dgcq8rczcshkvqvvhuq	.eJxVjMsOwiAQRf-FtSHyBpfu-w1kGAapGkhKuzL-uzbpQrf3nHNfLMK21rgNWuKc2YUJdvrdEuCD2g7yHdqtc-xtXebEd4UfdPCpZ3peD_fvoMKo3xoVpnMhJbUvYIIDAzJlwmJJOm2FSVp6UEULh7mEkIQi6YuwNjgtRWbvD_4ZOAk:1wdQDU:NWQ5dNbidqBjlqHnLE1osUD6cIm-HfdkUXMutUydHIE	2026-07-11 15:54:52.127493+05:30
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 48, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: billing_business_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_business_id_seq', 7, true);


--
-- Name: billing_centre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_centre_id_seq', 18, true);


--
-- Name: billing_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_customer_id_seq', 6, true);


--
-- Name: billing_document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_document_id_seq', 1, true);


--
-- Name: billing_projectdoc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_projectdoc_id_seq', 1, false);


--
-- Name: billing_sequence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_sequence_id_seq', 2, true);


--
-- Name: billing_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_service_id_seq', 24, true);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 12, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 16, true);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: billing_business billing_business_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_business
    ADD CONSTRAINT billing_business_pkey PRIMARY KEY (id);


--
-- Name: billing_centre billing_centre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_centre
    ADD CONSTRAINT billing_centre_pkey PRIMARY KEY (id);


--
-- Name: billing_customer billing_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_customer
    ADD CONSTRAINT billing_customer_pkey PRIMARY KEY (id);


--
-- Name: billing_document billing_document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_document
    ADD CONSTRAINT billing_document_pkey PRIMARY KEY (id);


--
-- Name: billing_projectdoc billing_projectdoc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_projectdoc
    ADD CONSTRAINT billing_projectdoc_pkey PRIMARY KEY (id);


--
-- Name: billing_sequence billing_sequence_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_sequence
    ADD CONSTRAINT billing_sequence_key_key UNIQUE (key);


--
-- Name: billing_sequence billing_sequence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_sequence
    ADD CONSTRAINT billing_sequence_pkey PRIMARY KEY (id);


--
-- Name: billing_service billing_service_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_service
    ADD CONSTRAINT billing_service_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: billing_document_doc_id_bb5264af; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_document_doc_id_bb5264af ON public.billing_document USING btree (doc_id);


--
-- Name: billing_document_doc_id_bb5264af_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_document_doc_id_bb5264af_like ON public.billing_document USING btree (doc_id varchar_pattern_ops);


--
-- Name: billing_projectdoc_doc_id_1226cadc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_projectdoc_doc_id_1226cadc ON public.billing_projectdoc USING btree (doc_id);


--
-- Name: billing_projectdoc_doc_id_1226cadc_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_projectdoc_doc_id_1226cadc_like ON public.billing_projectdoc USING btree (doc_id varchar_pattern_ops);


--
-- Name: billing_sequence_key_c05f1174_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_sequence_key_c05f1174_like ON public.billing_sequence USING btree (key varchar_pattern_ops);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

\unrestrict GlXa1yncTKSRY7S23DcpeBU8uAD4NsfqyxsGkzNIStLKhlKRiBefmHEFuq24mH0

