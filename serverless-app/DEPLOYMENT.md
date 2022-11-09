# Deploying to Public Cloud

We assume, that you will be using ***GitHub Actions*** to automate your deployment pipeline.
Terraform can be integrated with GitHub ***workflows***.

Terraform can, of course, also be run from your own computer. But this is of little use, when you work in a team.
Therefore, you should do this only to try things out. 

## Environments

To protect cloud applications from unwanted changes, it is typical to define different "environments" to which they are deployed.
At minimum this consists of
- Staging. An AWS infrastructure environment available/accessible to the development team.
- Production. The publicly available app

This is usually reflected in the GitHub branching pattern
- development : a branch where new code from the team gets merged into. This will be deployed to the staging environment in AWS
- main (or production): the released and publicly accessible product. Typically, the team decides the code in development is ready for release. It will then be merged into main/production at which stage, the app will be deployed from staging to production.
In both cases, deployment will be facilitated via ***GitHub actions***.

Note, this is only an example deployment pattern.
