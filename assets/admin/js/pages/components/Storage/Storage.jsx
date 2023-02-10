import React, { Component } from 'react';
import PropTypes from "prop-types";

import axios   from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Sanitaze   from "@commonFunctions/sanitaze";

import { LoaderTxt } from "@commonComponents/Elements/Loader";
import { Alert } from "@commonComponents/Elements/Alert";
import {ButtonIcon} from "@commonComponents/Elements/Button";

const URL_CLICK_DIRECTORY = "api_storage_directory";

export class Storage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            backs: [],
            directories: [],
            files: [],
            loadData: true,
            directory: ".."
        }
    }

    componentDidMount = () => { this.handleClick("", false, true); }

    handleClick = (path, isBack, force = false) => {
        const { loadData, backs } = this.state;

        if((!loadData || force) && path !== undefined){
            this.setState({ loadData: true })

            let nBacks = backs;
            if(isBack){ nBacks.pop(); }

            let self = this;
            axios({ method: "POST", url: Routing.generate(URL_CLICK_DIRECTORY), data: {'path': path} })
                .then(function (response) {
                    let data = response.data;
                    self.setState({
                        directory: path === "" ? ".." : path,
                        directories: JSON.parse(data.directories),
                        files: JSON.parse(data.files),
                        backs: isBack ? nBacks : [...backs, ...[path]],
                        loadData: false
                    })
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
            ;
        }
    }

    render () {
        const { loadData, backs, directories, files, directory } = this.state;

        let back = backs[backs.length - 2];

        console.log(files);

        return <div className="storage">
            <div className="storage-section">
                <div className="title">Dossiers</div>
                <div className="content-infos">
                    <div className="directories">
                        {back !== undefined && <Directory elem={{'path': back, name: back === "" ? ".." : back }}
                                                          onClick={this.handleClick} isBack={true} />}
                        {loadData
                            ? <LoaderTxt />
                            : (directories.map((dir, index) => {
                                return <Directory elem={dir} onClick={this.handleClick} isBack={false} key={index} />
                            }))
                        }
                    </div>
                </div>
            </div>

            {directory !== ".." && <div className="storage-section">
                <div className="title">Fichiers de {directory}</div>
                <div className="content-infos">
                    <div className="list-table">
                        <div className="items items-files">
                            <div className="item item-header">
                                <div className="item-content">
                                    <div className="item-infos">
                                        <div className="col-1">Fichier</div>
                                        <div className="col-2">Taille</div>
                                        <div className="col-3">Infos</div>
                                        <div className="col-4 actions" />
                                    </div>
                                </div>
                            </div>

                            {files.length > 0
                                ? files.map((elem, index) => {
                                    return <File elem={elem} key={index} />;
                                })
                                : <Alert>Aucun fichier dans le dossier.</Alert>
                            }
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    }
}

function Directory ({ elem, onClick, isBack }) {
    return <div className="directory" onClick={() => onClick(elem.path, isBack)} >
        <div className="directory-header">
            <div className="icon">
                <span className="icon-folder" />
            </div>
        </div>
        <div className="directory-body">
            <div className="name">{elem.name}</div>
        </div>
    </div>
}

Directory.propTypes = {
    elem: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    isBack: PropTypes.bool.isRequired
}

function File ({ elem }) {
    return <div className="item">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <a className="name">
                        <span className="icon-file" />
                        <span>{elem.name}</span>
                    </a>
                </div>
                <div className="col-2">
                    <div className="sub">{Sanitaze.toFormatBytesToSize(elem.size)}</div>
                </div>
                <div className="col-3">
                    <div className="sub">{Sanitaze.toDateFormat(new Date(elem.dateAt.date))}</div>
                </div>
                <div className="col-4 actions" >
                    <ButtonIcon icon="more" />
                </div>
            </div>
        </div>
    </div>
}
