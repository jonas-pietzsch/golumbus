const fs = require('fs')
const { Entries } = require('./entries')
const { Config } = require('./config')
jest.mock('./config')
jest.mock('fs')

describe('Entries', () => {
    let entries
    let config

    beforeEach(() => {
        config = new Config()
        config.getContents.mockReturnValue({ entries: {} })

        entries = new Entries({ config })
    })

    describe('getAll', () => {
        it('should return no saved entries if none present', () => {
            expect(entries.getAll()).toEqual({})
        })

        it('should return all present saved entries', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                },
            })

            expect(entries.getAll()).toEqual({
                test: { desc: 'someDesc', path: 'somePath', usages: 3 },
            })
        })
    })

    describe('count', () => {
        it('should count entries', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                },
            })

            expect(entries.count()).toEqual(1)
        })

        it('should count zero entries if non present', () => {
            config.getContents.mockReturnValue({ entries: {} })

            expect(entries.count()).toEqual(0)
        })
    })

    describe('resetUsages', () => {
        it('should reset usages of all entries and return the sum of all accumulated usages', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })

            expect(entries.resetUsages()).toEqual(5)
        })
    })

    describe('edit', () => {
        it('should edit description of entry', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })

            entries.edit('test', 'A new description')
            expect(config.setContents).toHaveBeenCalledWith({
                entries: {
                    test: {
                        desc: 'A new description',
                        path: 'somePath',
                        usages: 3,
                    },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })
        })
    })

    describe('add', () => {
        it('should add new entry', () => {
            config.getContents.mockReturnValue({
                entries: {},
            })

            entries.add('test', {
                description: 'someDescription',
                path: 'somePath',
            })
            expect(config.setContents).toHaveBeenCalledWith({
                entries: {
                    test: {
                        desc: 'someDescription',
                        path: 'somePath',
                        usages: 0,
                    },
                },
            })
        })
    })

    describe('search', () => {
        it('should find entries with matching name', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })

            expect(entries.search('test')).toEqual([
                { desc: 'someDesc', name: 'test', path: 'somePath', usages: 3 },
            ])
        })

        it('should find entries with similar name', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    test2: { desc: 'other', path: 'someOtherPath', usages: 5 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })

            expect(entries.search('test')).toEqual([
                {
                    desc: 'other',
                    name: 'test2',
                    path: 'someOtherPath',
                    usages: 5,
                },
                { desc: 'someDesc', name: 'test', path: 'somePath', usages: 3 },
            ])
        })
    })

    describe('deleteNonExistingPaths', () => {
        it('should delete entries whose directory does not exist', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    nonExisting: {
                        desc: 'someDesc',
                        path: 'somePath',
                        usages: 3,
                    },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                    anotherNonExisting: {
                        desc: 'someDesc',
                        path: 'somePath',
                        usages: 3,
                    },
                },
            })

            fs.existsSync
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false)

            const deletedEntries = entries.deleteNonExistingPaths()
            expect(deletedEntries).toBe(2)

            expect(config.setContents).toHaveBeenCalledTimes(1)
            expect(config.setContents).toHaveBeenCalledWith({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })
        })
    })

    describe('delete', () => {
        it('should delete an entry by name', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })

            entries.delete('test')
            expect(config.setContents).toHaveBeenCalledWith({
                entries: {
                    other: {
                        desc: 'someDesc',
                        path: 'otherPath',
                        usages: 2,
                    },
                },
            })
        })

        it('should do nothing if entry not existing', () => {
            config.getContents.mockReturnValue({
                entries: {},
            })

            entries.delete('somethingNonExisting')

            expect(config.setContents).not.toHaveBeenCalled()
        })
    })

    describe('get', () => {
        it('should return found entry', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })

            expect(entries.get('test')).toEqual({
                desc: 'someDesc',
                path: 'somePath',
                usages: 3,
            })
        })

        it('should return undefined for entry not existing', () => {
            config.getContents.mockReturnValue({
                entries: {},
            })

            expect(entries.get('test')).toBeUndefined()
        })
    })

    describe('getPath', () => {
        it('should return path of found entry', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                    other: { desc: 'someDesc', path: 'otherPath', usages: 2 },
                },
            })

            expect(entries.getPath('test')).toEqual('somePath')
            expect(config.setContents).toHaveBeenCalled()
        })

        it('should increment usage for found entry', () => {
            config.getContents.mockReturnValue({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 3 },
                },
            })

            expect(entries.getPath('test')).toEqual('somePath')
            expect(config.setContents).toHaveBeenCalledWith({
                entries: {
                    test: { desc: 'someDesc', path: 'somePath', usages: 4 },
                },
            })
        })

        it('should return undefined for entry not existing', () => {
            config.getContents.mockReturnValue({
                entries: {},
            })

            expect(entries.getPath('test')).toBeUndefined()
            expect(config.setContents).not.toHaveBeenCalled()
        })
    })
})
