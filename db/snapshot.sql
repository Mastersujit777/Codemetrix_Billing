--
-- PostgreSQL database dump
--

\restrict yzcnOnRNBJz5XfwxEB3HOVg9hswI4djIVH0PP8mX8UQOztSTS0GYDxd1Uy2b9Np

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
1	pbkdf2_sha256$870000$bejzdAT0CN6jPkYw5JJxZB$5/0sgZDAENPvsuCheYKAwkzYiw8a5qzlm6bbD8N8jfw=	2026-07-08 09:45:14.957272+05:30	f	admin				f	t	2026-06-27 15:54:04.845786+05:30
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
17	CodeMetrix	Proprietorship · IT Training, Internships & Software Development	Patia, Bhubaneswar, Khordha, Odisha – 751024	21BIQPR2894N1ZF		UDYAM-OD-19-0162791	Odisha	21		codemetrix1@ucobank	data:image/jpeg;base64,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	UCO Bank	Codemetrix	25430210003343	UCBA0002543	{}
\.


--
-- Data for Name: billing_centre; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_centre (id, "position", code, name, address, extra) FROM stdin;
46	0	BAL	Balipatna	Balipatna, Khordha, Odisha	{}
47	1	KES	Kesura–Bhubaneswar	Kesura, Bhubaneswar, Odisha	{}
48	2	PAT	Patia-Bhubaneswar	Patia, Nandan Vihar, Bhubaneswar	{}
\.


--
-- Data for Name: billing_customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_customer (id, "position", cid, name, kind, username, address, "stateName", "stateCode", gstin, phone, email, "contactPersonName", "contactPersonPhone", notes, extra) FROM stdin;
25	0	cus_mn2hsj	M/S DIVIKSHA SALES MART	client	ms_diviksha	PLOT NO-928/1573, AT- Kheras, PO- Brahmansailo, Cuttack-754018	Odisha	21	21NFHPS3224D1ZL	9937896866	divikshasales.mart@gmail.com	Sumit Mohapatra	9937835200		{}
26	1	cus_4m6xuu	Jangyadatta Mallick	student	jangyadatta_mallick	Balipatna	Odisha	21		7735708285	jangyadattamallik47@gmail.com	Jangyadatta Mallick	7735708285		{}
\.


--
-- Data for Name: billing_document; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_document (id, "position", doc_id, number, kind, date_iso, data) FROM stdin;
19	0	doc_5n4mu9	CM/PAT/INV/DIG/26-27/1	INV	2026-06-26	{"id": "doc_5n4mu9", "no": "CM/PAT/INV/DIG/26-27/1", "fee": 3500, "net": 3500, "cgst": 266.95, "igst": 0, "rate": 18, "sgst": 266.95, "type": "INV", "inter": false, "total": 3500, "payRef": "", "dateISO": "2026-06-26", "payMode": "Cash", "service": {"sac": "998361", "name": "Digital Advertising Services", "prefix": "DIG"}, "taxable": 2966.1, "advTotal": 0, "advances": [{"no": "", "amt": ""}], "customer": {"name": "M/S DIVIKSHA SALES MART", "gstin": "21NFHPS3224D1ZL", "phone": "9937896866", "address": "PLOT NO-928/1573, AT- Kheras, PO- Brahmansailo, Cuttack-754018", "username": "ms_diviksha", "stateCode": "21", "stateName": "Odisha"}, "lastPaid": 0, "signMode": "sign", "inclusive": true, "centreCode": "PAT"}
20	1	doc_4d8k7d	CM/BAL/INV/TRN/26-27/1	INV	2026-06-27	{"id": "doc_4d8k7d", "no": "CM/BAL/INV/TRN/26-27/1", "fee": 6000, "net": 6000, "cgst": 0, "igst": 0, "rate": 0, "sgst": 0, "type": "INV", "inter": false, "total": 6000, "payRef": "", "dateISO": "2026-06-27", "payMode": "Cash", "service": {"sac": "999293", "name": "Training Programme", "prefix": "TRN"}, "taxable": 6000, "advTotal": 0, "advances": [{"no": "", "amt": ""}], "customer": {"name": "Jangyadatta Mallick", "gstin": "", "phone": "7735708285", "address": "Balipatna", "username": "jangyadatta_mallick", "stateCode": "21", "stateName": "Odisha"}, "lastPaid": 0, "signMode": "sign", "inclusive": true, "centreCode": "BAL"}
21	2	doc_op8qe8	CM/BAL/RV/DIG/26-27/1	RV	2026-07-08	{"id": "doc_op8qe8", "no": "CM/BAL/RV/DIG/26-27/1", "fee": 3500, "net": 1000, "cgst": 76.27, "igst": 0, "rate": 18, "sgst": 76.27, "type": "RV", "basis": 1000, "inter": false, "total": 1000, "payRef": "example_delete_on_use", "dateISO": "2026-07-08", "payMode": "UPI", "service": {"sac": "998361", "name": "Digital Advertising Services", "prefix": "DIG"}, "taxable": 847.46, "customer": {"name": "M/S DIVIKSHA SALES MART", "gstin": "21NFHPS3224D1ZL", "phone": "9937896866", "address": "PLOT NO-928/1573, AT- Kheras, PO- Brahmansailo, Cuttack-754018", "username": "ms_diviksha", "stateCode": "21", "stateName": "Odisha"}, "signMode": "sign", "inclusive": true, "instLabel": "1st installment", "centreCode": "BAL"}
22	3	doc_xh7cq3	CM/BAL/RV/TRN/26-27/2	RV	2026-07-08	{"id": "doc_xh7cq3", "no": "CM/BAL/RV/TRN/26-27/2", "fee": 6000, "net": 2000, "cgst": 0, "igst": 0, "rate": 0, "sgst": 0, "type": "RV", "basis": 2000, "inter": false, "total": 2000, "payRef": "", "dateISO": "2026-07-08", "payMode": "Cash", "service": {"sac": "999293", "name": "Training Programme", "prefix": "TRN"}, "taxable": 2000, "customer": {"name": "Jangyadatta Mallick", "gstin": "", "phone": "7735708285", "address": "Balipatna", "username": "jangyadatta_mallick", "stateCode": "21", "stateName": "Odisha"}, "signMode": "sign", "inclusive": true, "instLabel": "1st installment", "centreCode": "BAL"}
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
22	PAT:INV:26-27	1
23	BAL:INV:26-27	1
24	BAL:RV:26-27	2
\.


--
-- Data for Name: billing_service; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_service (id, "position", sid, name, prefix, sac, rate, inclusive, extra) FROM stdin;
61	0	svc_int	Internship Programme	INT	999293	18	t	{}
62	1	svc_trn	Training Programme	TRN	999293	0	t	{}
63	2	svc_sw	Software Development	SWD	998314	18	f	{}
64	3	ser_lod5y1	Digital Advertising Services	DIG	998361	18	t	{}
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
siv6cogw5061gcfuh8nkarbiregnezy9	.eJxVjMsOwiAQRf-FtSHyBpfu-w1kGAapGkhKuzL-uzbpQrf3nHNfLMK21rgNWuKc2YUJdvrdEuCD2g7yHdqtc-xtXebEd4UfdPCpZ3peD_fvoMKo3xoVpnMhJbUvYIIDAzJlwmJJOm2FSVp6UEULh7mEkIQi6YuwNjgtRWbvD_4ZOAk:1wdQTh:Yb8QqRFSb9bb7nEK9PEuEcvpUR2G9VwRrl7nW5-Wuk8	2026-07-11 16:11:37.444637+05:30
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

SELECT pg_catalog.setval('public.billing_business_id_seq', 17, true);


--
-- Name: billing_centre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_centre_id_seq', 48, true);


--
-- Name: billing_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_customer_id_seq', 26, true);


--
-- Name: billing_document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_document_id_seq', 22, true);


--
-- Name: billing_projectdoc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_projectdoc_id_seq', 1, false);


--
-- Name: billing_sequence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_sequence_id_seq', 24, true);


--
-- Name: billing_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_service_id_seq', 64, true);


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

\unrestrict yzcnOnRNBJz5XfwxEB3HOVg9hswI4djIVH0PP8mX8UQOztSTS0GYDxd1Uy2b9Np

