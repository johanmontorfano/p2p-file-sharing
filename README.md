# P2P File Sharing

## Idea

This is a web-app that allows users to share files anywhere on Earth with a P2P
network. It uses PeerJS to initiate P2P connections, and SolidJS as a UI 
framework.

The idea was to build an app that allows two users (a broadcaster and a receiver) 
to transmit securely any kind of files through a P2P network.

A transfer is identified through a Transfer ID.

**Security is guaranteed by the following principles:**
- The broadcaster shares the SHA-256 of the file to transfer.
- The receiver verifies the integrity of the received file by comparing SHA’s.

### Issues

There is a pretty important issue regarding the availability of this app:
- On Safari, some VPNs, Chromium-based navigators, the socket connection fails 
with a `1006` code.

## Roadmap
- [x] P2P File sharing
- [x] Working version
- [ ] Allow for a transfer to be cancelled
- [ ] Solve an issue on the broadcaster side, if the broadcasted file changes, the change is not registered and the previously broadcasted file is shared with the metadata of the new one
- [ ] Implement integrity checks on the received file (SHA)
