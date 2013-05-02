/*global describe, it */
'use strict';
(function () {
    describe('Solar Panel Simulater', function () {
        describe('maybe a module exported', function () {
            it('should be exist wpsp.sp object', function () {
              expect(window.wpsp).to.be.a('object');
              expect(window.wpsp.sp).to.be.a('object');
              expect(window.wpsp.sp.SolarPanelSimulator).to.be.a('function');
            });

            it('should get simulator instance', function () {
              var ins = new wpsp.sp.SolarPanelSimulator({});
              expect(ins).to.be.a('object');
              expect(ins.calc).to.be.a('function');
            });

            it('should get solar panel profiles', function () {
              var profiles = wpsp.sp.profiles;
              expect(profiles).to.be.a('array');

              profiles.forEach(function(p) {
                expect(p.name).to.be.a('string');
                expect(p.initCost).to.be.a('number');
                expect(p.pow).to.be.a('number');
                expect(p.effModule).to.be.a('number');
                expect(p.usefulLife).to.be.a('number');
              });
            });

            it('should get calculation result', function () {
              var profile = wpsp.sp.profiles[0];
              var ins = new wpsp.sp.SolarPanelSimulator(profile);
              ins.calc(0.3043); // Average of cloud amount
              var series = ins.getDataSeries();
              expect(series[0]).to.have.length(240);
              expect(series[1]).to.have.length(240);
              expect(ins.getCostRecoveryTermNorm()).to.equal(131);
              expect(ins.getCostRecoveryTerm()).to.equal(131);
            });

            it('should get calculation result, less cloud', function () {
              var profile = wpsp.sp.profiles[0];
              var ins = new wpsp.sp.SolarPanelSimulator(profile);
              ins.calc(0.5777); // less cloud 
              var series = ins.getDataSeries();
              expect(series[0]).to.have.length(240);
              expect(series[1]).to.have.length(240);
              expect(ins.getCostRecoveryTermNorm()).to.equal(131);
              expect(ins.getCostRecoveryTerm()).to.equal(88);
            });

            it('should get calculation result, more cloud', function () {
              var profile = wpsp.sp.profiles[0];
              var ins = new wpsp.sp.SolarPanelSimulator(profile);
              ins.calc(0.1944); // many cloud
              var series = ins.getDataSeries();
              expect(series[0]).to.have.length(240);
              expect(series[1]).to.have.length(240);
              expect(ins.getCostRecoveryTermNorm()).to.equal(131);
              expect(ins.getCostRecoveryTerm()).to.equal(174);
            });

        });
    });
})();
