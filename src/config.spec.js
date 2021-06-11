const { Config } = require('./config')
const jsonfile = require('jsonfile')
const { getUserHome } = require('./system')
jest.mock('jsonfile')
jest.mock('./system')

describe('Config', () => {
    let config

    beforeEach(() => {
        jest.resetAllMocks()

        getUserHome.mockReturnValue('/Users/someUser')
        jsonfile.readFileSync.mockReturnValue({
            entries: {
                playground: {
                    desc: 'my playground',
                    path: '/Users/some/playground',
                    usages: 3,
                },
            },
        })

        config = new Config()
    })

    describe('getContents', () => {
        it('should return loaded config contents', () => {
            expect(config.getContents()).toEqual({
                entries: {
                    playground: {
                        desc: 'my playground',
                        path: '/Users/some/playground',
                        usages: 3,
                    },
                },
            })
        })
    })

    describe('setContents', () => {
        it('should assign and save the updated contents', () => {
            config.setContents({ entries: {} })

            expect(config.data).toEqual({ entries: {} })
            expect(jsonfile.writeFileSync).toHaveBeenCalledWith(
                '/Users/someUser/.config/golumbus.json',
                {
                    entries: {},
                },
                { spaces: 4 },
            )
        })
    })

    describe('save', () => {
        it('should save the jsonfile', () => {
            config.save()

            expect(jsonfile.writeFileSync).toHaveBeenCalledWith(
                '/Users/someUser/.config/golumbus.json',
                {
                    entries: {
                        playground: {
                            desc: 'my playground',
                            path: '/Users/some/playground',
                            usages: 3,
                        },
                    },
                },
                { spaces: 4 },
            )
        })
    })
})
