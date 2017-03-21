(function () {
    var editorPromise = tinymce.init({
        selector: '#tinymceEditor',
        menubar: 'edit insert view format tools',
        toolbar: 'image emoticons table ',
        plugins: 'image imagetools emoticons advlist table wordcount',
        imagetools_cors_hosts:['localhost:3000'],
        height: 400,
        image_caption: true,
        image_list: './image-list'
    });
    var richEditor = null;
    var htmlTextArea = $('#htmlContent');
    var htmlEditor = CodeMirror.fromTextArea(htmlTextArea[0], {
        lineNumbers: true,
        matchTags: { bothTags: true },
        mode: "xml"
    });
    var blogDescription;
    var uiState = {};
    uiState.richEditor = true;
    uiState.htmlEditor = true;
    uiState.createBlog = {
        title: '',
        description: '',
        url: '',
        tags: '',
        date: '',
        visibility: 'visible'
    };

    var createBlogInput = {
        title: { domid: '#inTitle' },
        description: { domid: '#inDescription' },
        url: { domid: '#inUrl' },
        tags: { domid: '#inTags' },
        visibility: { domid: '#inVisibility' },
        date: { domid: '#inDate' }
    };


    //Set up one wayy binding from input to model
    _.forEach(createBlogInput, function (val, key) {
        $(val.domid).on('change', function () {
            uiState.createBlog[key] = this.value;
        });
    });
    //En of one way binding

    function getInputValue(key) {
        return $(createBlogInput[key].domid).val();
    }


    $.getJSON("../blog_content/blog_description.json",
        function (data) {
            blogDescription = data;
            $('#blogsList').empty();
            _.forEach(blogDescription.posts, function (val) {
                $('#blogList').append('<option value="' + val.title + '">' + "" + '</option>');
            });
        });

    var editorState = {
        'rich nohtml': {
            richEditorCss: 'col-md-12',
            htmlEditorCss: 'hidden',
            richEditorBtnCss: 'dhe-btn active',
            htmlEditorBtnCss: 'dhe-btn'
        },
        'norich html': {
            richEditorCss: 'hidden',
            htmlEditorCss: 'col-md-12',
            richEditorBtnCss: 'dhe-btn',
            htmlEditorBtnCss: 'dhe-btn active'
        },
        'rich html': {
            richEditorCss: 'col-md-6',
            htmlEditorCss: 'col-md-6',
            richEditorBtnCss: 'dhe-btn active',
            htmlEditorBtnCss: 'dhe-btn active'
        },
        'norich nohtml': {
            richEditorCss: 'hidden',
            htmlEditorCss: 'hidden',
            richEditorBtnCss: 'dhe-btn',
            htmlEditorBtnCss: 'dhe-btn'
        },
        processEditorState: function (richState, htmlState) {
            var stateName = richState + ' ' + htmlState;
            $('#richEditorCol')
                .removeClass()
                .addClass(editorState[stateName].richEditorCss);

            $('#htmlEditorCol')
                .removeClass()
                .addClass(editorState[stateName].htmlEditorCss);

            $('#rawHtmlBtn')
                .removeClass()
                .addClass(editorState[stateName].htmlEditorBtnCss);

            $('#richEditorBtn')
                .removeClass()
                .addClass(editorState[stateName].richEditorBtnCss);
        }

    };

    $('#richEditorBtn').on('click', function () {
        uiState.richEditor = !uiState.richEditor;
        onEditorStateClick();
    });

    $('#rawHtmlBtn').on('click', function () {
        uiState.htmlEditor = !uiState.htmlEditor;
        onEditorStateClick();
    });

    function onEditorStateClick() {
        editorState.processEditorState((uiState.richEditor ? 'rich' : 'norich'),
            (uiState.htmlEditor ? 'html' : 'nohtml'));
    }


    function updateHtml() {
        if (!richEditor || !htmlEditor) {
            return;
        }
        htmlEditor.setValue(richEditor.getContent());
    };

    function updateRichEditor() {
        if (!richEditor || !htmlEditor) {
            return;
        }
        richEditor.setContent(htmlEditor.getValue());
    };

    function saveTemplate() {
        if (!uiState.createBlog.htmlSrcUrl) {
            return;
        }
        $.post({
            dataType: "json",
            contentType: "application/json",
            url: "./savetemplate",
            data: JSON.stringify({ html: richEditor.getContent(), htmlSrcUrl: uiState.createBlog.htmlSrcUrl })
        }).done(function (data) {
        });
    }
    var saveTemplateDebounce = _.debounce(saveTemplate, 1000);

    $('#refreshBtn').on('click', function () {
        updateHtml();
        updateRichEditor();
        saveTemplate();
    });
    const debounceUpdate = _.debounce(() => { updateHtml(); saveTemplateDebounce(); }, 300);

    editorPromise.then(function (e) {
        richEditor = e[0];
        richEditor.on('keyup', debounceUpdate);
        richEditor.on('contextmenu', debounceUpdate);
        richEditor.on('mouseleave', debounceUpdate);
        richEditor.dom.loadCSS('../node_modules/bootstrap/dist/css/bootstrap.min.css');
        tinymce.ScriptLoader.load('../node_modules/bootstrap/dist/js/bootstrap.min.js');
        updateHtml();
    });

    htmlEditor.on('keyup', _.debounce(updateRichEditor, 300));


    //Create Blog Entry
    $('#openBlog').on('click', function () { });
    var urlInput = $('#inUrl');
    $('#inTitle').on('keyup', function () {
        urlInput.val(_.kebabCase(this.value));
        urlInput.trigger("change");
    });

    $('#inTitle').on('change blur click', function () {
        var val = $(this).val();
        var ret = _.find(blogDescription.posts, function (blog) {
            return blog.title === val;
        });
        if (ret == undefined) {
            return;
        }
        $(createBlogInput['description'].domid).val(ret.description);
        $(createBlogInput['url'].domid).val(ret.url);
        $(createBlogInput['tags'].domid).val(ret.tags);
        $(createBlogInput['date'].domid).val(ret.date);
        $(createBlogInput['visibility'].domid).val(ret.visibility);

    });

    $('#createBlogModal').on('show.bs.modal', function (e) {

    });

    $('#openBlog').on('click', function () {
        var title = $('#inTitle').val();
        var ret = _.find(blogDescription.posts, function (blog) {
            return blog.title === title;
        });
        if (ret === undefined) {
            createBlog();
        } else {
            uiState.createBlog = ret;
            fetchTemplate(ret.htmlSrcUrl);
        }
    });


    function createBlog() {
        $.post({
            dataType: "json",
            contentType: "application/json",
            url: "./createblog",
            data: JSON.stringify(uiState.createBlog)
        }).done(function (data) {
            uiState.createBlog.htmlSrcUrl = data.htmlSrcUrl;
            fetchTemplate(data.htmlSrcUrl);
        });
    }

    function fetchTemplate(htmlSrcUrl) {
        $.get(htmlSrcUrl).done(function (templateData) {
            richEditor.setContent(templateData);
            updateHtml();
            updateRichEditor();
        });
    }




})();