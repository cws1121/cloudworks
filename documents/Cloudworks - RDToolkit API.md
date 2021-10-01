# CLOUDWORKS - RDT API


# Introduction

The communication between RDToolkit client and Cloudworks server is characterized by an authentication scheme that relies on DSN tokens. Each API endpoint has a DSN token embedded in it. Each token is associated with a workspace and could be generated via the admin panel. In that sense tokens are being used to allow submitting data securely, but against domain authentication. Another important aligned characteristic of this authentication is that it is write-only. The devices are able to submit new session data, but they don’t have access to reading any information as a result of that.

Some characteristics of RDToolkit - Cloudworks authentication scheme:



* Write-Only authorization,
* Token encodes both authorization and destination of data, 
* Authorization is associated with a workspace / internal domain,
* Token has explicit permissions applied to it.


# Endpoints


## Ingest Test Session

PUT: /ingest/${DSN}/test_session/${GUID}


### Description

Adds a new test session record for the domain.


### Path Variables



* DSN (string/*required) - Authentication token associated with some domain.
* GUID (string/*required) - Unique identifier for the test session record.


### Request body


```
{
    "result": {
        "raw_image_file_path": string,
        "results_classifier": {},
        "time_read": datetime,
        "results": {
            "diag_one": string,
            "diag_two": string
        }
    },
    "test_profile_id": string,
    "time_started": datetime,
    "time_expired": datetime,
    "configuration": {
        "flavor_text_two": string,
        "classifier_mode": string,
        "flags": {},
        "provision_mode_data": string,
        "session_type": string,
        "provision_mode": string,
        "flavor_text": string
    },
    "time_resolved": datetime,
    "id": string,
    "state": string
}
```



### Example value


```
{
    "result": {
        "raw_image_file_path": "testpath",
        "results_classifier": {},
        "time_read": "2020-10-16T16:25:34.467Z",
        "results": {
            "diag_one": "positive",
            "diag_two": "negative"
        }
    },
    "metrics": {
        "data": {
            "instructions_viewed": "true",
            "image_capture_attempts": "1"
        }
    },
    "test_profile_id": "test_id",
    "time_started": "2020-10-16T16:25:33.977Z",
    "time_expired": "2020-10-16T16:25:34.727Z",
    "configuration": {
        "flavor_text_two": "flavor_two",
        "classifier_mode": "PRE_POPULATE",
        "flags": {},
        "provision_mode_data": "test_id",
        "session_type": "ONE_PHASE",
        "provision_mode": "TEST_PROFILE",
        "flavor_text": "flavor_one"
    },
    "time_resolved": "2020-10-16T16:25:34.227Z",
    "state": "COMPLETE"
}
```



### Responses

201 Success!

409 Test session with the same id already exists.

500 Internal Server Error


## Ingest Logs

PUT: /ingest/${DSN}/test_session/${GUID}/logs


### Description

Adds a new log record for the test session.


### Path Variables



* DSN (string/*required) - Authentication token associated with some domain.
* GUID (string/*required) - Unique identifier for the test session record.


### Request body


```
{
  "entries": [
      {
        "timestamp": datetime,
        "tag": string,
        "message": string,
        "json": string,
        "media_key": string
      },
    ]
}
```



### Example value


```
{
  "entries": [
    {
      "timestamp": "2021-01-25T16:12:21.563+00:00",
      "tag": "user_action",
      "message": "Skipped instructions"
    },
    {
      "timestamp": "2021-01-25T16:12:24.563+00:00",
      "tag": "user_action",
      "message": "User initiated timer override"
    },
    {
      "timestamp": "2021-01-25T16:12:28.563+00:00",
      "tag": "classifier_dummy",
      "message": "Classifier returned error, json context attached",
      "json": {
        "error_code": "4",
        "arbitrary_json": "can be in this block"
      },
      "media_key": "error_image_1"
    }
  ]
}
```



### Responses

201 Success!

500 Internal Server Error


## Ingest Media

PUT: /ingest/${DSN}/test_session/${GUID}/media/${MEDIA_ID}


### Description

Adds a new media file for the test session.


### Request Headers

Content-Disposition

attachment; filename=file_name.png


### Path Variables



* DSN (string/*required) - Authentication token associated with some domain.
* GUID (string/*required) - Unique identifier for the test session record.
* MEDIA_ID (string/*required) - External ID for the media file.


### Request body

File


### Responses

201 Success!

409 Media record with the same id already exists.

500 Internal Server Error
