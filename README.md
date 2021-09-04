# action-publish-s3

GitHub action to zip a directory and upload to S3

Example:
```yaml
steps:
  using: innodatalabs/action-publish-s3@2.0.2
  with:
    directory: /tmp
    name-pattern: candy-shop-{{TODAY_YMD}}
    target-pattern: s3://my-bucket/{{GITHUB_RUN_NUMBER}}/{{name}}.zip
    acl: private
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Inputs
